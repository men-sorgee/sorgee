import { Member, UserEmailChange } from 'lib/models'
import { ApiResponse } from 'lib/utils'
import { findUser, updateUser } from 'lib/services/directus/server/users'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { SendGridCategory, SendGridTemplate, sendNotificationEmail } from 'lib/services/sendgrid/server'
import { baseUrl } from 'lib/config'
import { uuidv4 } from 'lib/utils'
export default async function listUserInvites(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<boolean>>
) {
  try {
    withMethods(req, ['POST'])
    const member = await withMember(req, res)

    const { email, email_new } = req.body as UserEmailChange
    if (member.email != email)
      throw new Error("Email address does not belong to you")

    const existingUser = await findUser<Member>(email_new)
    if (existingUser && existingUser.id != member.id)
      throw new Error('Email already in use')

    const email_token = uuidv4()

    await updateUser(member.id, { email_new, email_token })

    await sendNotificationEmail(
      email_new,
      member.first_name,
      'Email Change Confirmation',
      'You have requested to change your email address. Please click the button below to confirm the change.',
      {
        button_text: 'Confirm Email Change',
        button_url: `${baseUrl}/api/my/email/verify?token=${encodeURIComponent(email_token)}&email=${encodeURIComponent(email)}`,
      },
      SendGridTemplate.Notification,
      SendGridCategory.Notification
    )

    return res.status(200).json(ApiResponse(true))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(false))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
