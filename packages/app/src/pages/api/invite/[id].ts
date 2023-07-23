import { notifications } from 'lib/config'
import { ApiResponse, EventUser, MemberLevel, UserType } from 'lib/models'
import {
  getInvite,
  getAppNotification,
  getUser,
  updateInvite,
  updateUser,
} from 'lib/services/directus/server'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
} from 'lib/services/sendgrid/server'
import { withMethods, withStaff } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Invite(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventUser> | null>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    await withStaff(req, res)
    const { id } = req.query

    if (id == undefined) {
      return res.status(404).json(ApiResponse(null, 'Not found'))
    }

    const invite_id = Number(id)
    const invite = await getInvite(invite_id)
    if (!invite) {
      return res.status(404).json(ApiResponse(null, 'Not invited'))
    }

    switch (method) {
      case 'GET':
        return res.status(200).json(ApiResponse(invite))
      case 'POST':
        let { user_id, paid, signed_waiver } = req.body
        user_id = String(user_id)
        paid = Boolean(paid)
        signed_waiver = Boolean(signed_waiver)
        const attendee = await getUser(user_id)
        if (!attendee) {
          return res.status(401).json(ApiResponse(null, 'User not found'))
        }

        await updateInvite(invite_id, { paid, attended: true })

        // if they are an inductee or pledge, make them a brother
        const user_type: UserType =
          MemberLevel[attendee.user_type] < MemberLevel.brother ? 'brother' : attendee.user_type

        await updateUser(user_id, {
          signed_waiver,
          user_type,
          status: 'active',
        })

        if (MemberLevel[attendee.user_type] < MemberLevel.brother) {
          // send congrats email
          const congratsBrotherEmail = await getAppNotification(notifications.congratsEmail.brother)
          if (congratsBrotherEmail == null) throw new Error('Notification not found')

          const { button_text, button_url, subject, body, data, template, category } =
            congratsBrotherEmail

          await sendNotificationEmail(
            attendee.email,
            attendee.first_name,
            subject.replace('$NAME$', attendee.first_name),
            body.replace('$NAME$', attendee.first_name),
            {
              ...data,
              button_text,
              button_url,
              user_id: attendee.id,
            },
            template as SendGridTemplate,
            category as SendGridCategory,
            congratsBrotherEmail.id
          )
        }
    }

    res.status(200).json(ApiResponse(invite))
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
