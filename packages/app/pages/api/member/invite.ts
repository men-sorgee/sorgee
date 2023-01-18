import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, InviteLink } from 'lib/models'
import { withMember, withMethods } from 'lib/utils/server'
import { sendNotificationEmail } from 'lib/services/sendgrid/server'
import { createUser } from 'lib/services/directus/server'

async function Invite(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return

    const member = await withMember(req, res)
    if (!member) return res.status(401).end()

    const { email, link } = req.body as InviteLink
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
    await createUser({
      email,
      user_type: 'user',
      status: 'new',
      vouched_by: member.id,
      notes: `Invited by ${member.first_name} ${member.last_name}`,
      application_status: 'apply',
    })

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Invite
