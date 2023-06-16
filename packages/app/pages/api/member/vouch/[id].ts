import { notifications } from 'lib/config'
import { ApiResponse, MemberLevel, UserBuddy } from 'lib/models'
import {
  addUserNotification,
  getMember,
  getNotification,
  updateUser,
} from 'lib/services/directus/server'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
} from 'lib/services/sendgrid/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function VouchForMember(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserBuddy> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'GET'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getMember(user_id)

    if (method == 'GET') {
      if (them.vouched_by) {
        const voucher = await getMember(them.vouched_by as string)
        const { id, nickname, picture } = voucher || {}
        return res.status(200).json(ApiResponse({ id, nickname, picture }))
      } else {
        return res.status(200).json(ApiResponse({ id: undefined }))
      }
    } else if (method == 'POST') {
      if (them == null || them.user_type != 'pledge' || them.vouched_by != undefined) {
        return res.status(404).json(ApiResponse(null, 'Not Found'))
      }
      if (MemberLevel[me.user_type] < MemberLevel.brother) {
        return res.status(401).json(ApiResponse(null, 'Unauthorized'))
      }

      await updateUser(user_id, {
        vouched_by: me.id,
        user_type: 'inductee',
      })

      // send congrats email
      const congratsInducteeEmail = await getNotification(notifications.congratsInductee)
      if (congratsInducteeEmail == null) throw new Error('Notification not found')

      const { button_text, button_url, subject, body, data, template, category } =
        congratsInducteeEmail
      await sendNotificationEmail(
        them.email,
        them.first_name,
        subject.replace('$NAME$', them.first_name),
        body.replace('$NAME$', them.first_name),
        {
          ...data,
          button_text,
          button_url,
          user_id: them.id,
        },
        template as SendGridTemplate,
        category as SendGridCategory,
        congratsInducteeEmail.id
      )

      await addUserNotification({
        user_id: them.id,
        message: `You have been vouched for by ${me.nickname} and are now an Inductee!`,
      })

      return res.status(200).json(
        ApiResponse({
          id: me.id,
          nickname: me.nickname,
          picture: me.picture,
        })
      )
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
