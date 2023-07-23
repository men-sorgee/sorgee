import { ApiResponse, Member, UserLike } from 'lib/models'
import { getUser } from 'lib/services/directus/server/users'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
} from 'lib/services/sendgrid/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

import { adminBaseUrl } from 'lib/config'

export default async function MemberReport(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserLike> | ApiResponse>
) {
  try {
    withMethods(req, ['POST'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)
    const { message } = req.body

    const them = await getUser<Member>(user_id)
    if (them == null) {
      res.status(404).json(ApiResponse(null, 'Not Found'))
    }

    await sendNotificationEmail(
      'system@thebrotherhoodgroup.org',
      them.nickname || them.first_name,
      `${me.nickname || me.first_name} reported ${them.nickname || them.first_name}`,
      message + `\n\n[View reporter in Admin](${adminBaseUrl}/admin/content/users/${me.id})`,
      {
        user_id: them.id,
        button_text: 'View Reported in Admin',
        button_url: `${adminBaseUrl}/admin/content/users/${them.id}`,
      },
      SendGridTemplate.Notification,
      SendGridCategory.Notification
    )

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
