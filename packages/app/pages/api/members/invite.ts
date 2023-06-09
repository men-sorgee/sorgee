import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, InviteLink } from 'lib/models'
import { withMember, withMethods } from 'lib/utils/server'
import { sendNotificationEmail } from 'lib/services/sendgrid/server'
import { createUser, findUser, updateUser } from 'lib/services/directus/server'

async function Invite(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])
    const member = await withMember(req, res)

    const { email, link } = req.body as InviteLink


    const newUser = await findUser(email.toLocaleLowerCase())
    if (newUser) {
      switch (newUser.user_type) {
        case 'subscriber': {
          await updateUser(newUser.id, {
            user_type: 'applicant',
            vouched_by: member.id,
            notes: `Invited by ${member.first_name} ${member.last_name}`,
            application_status: 'apply',
          })
          break
        }
        case 'applicant': {
          await updateUser(newUser.id, {
            vouched_by: member.id,
            notes: `Invited by ${member.first_name} ${member.last_name}`,
          })
          break
        }
      }
    } else {
      await createUser({
        email: email.toLocaleLowerCase(),
        user_type: 'applicant',
        status: 'active',
        vouched_by: member.id,
        notes: `Invited by ${member.first_name} ${member.last_name}`,
        application_status: 'apply',
      })
    }

    await sendNotificationEmail(
      email,
      `${member.first_name}'s Friend`,
      `${member.first_name} ${member.last_name} has invited you to join our community!`,
      `Begin your application, by clicking the button below.`,
      {
        button_text: `Accept Invitation`,
        button_url: link,
      }
    )

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Invite
