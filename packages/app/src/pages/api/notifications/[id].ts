import { ApiResponse, AppNotificationStatusType } from 'lib/models'
import { markAppNotification, markAppNotificationRead } from 'lib/services/directus/server'
import { withMethods, withUser } from 'lib/utils/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function getUserNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const method = withMethods(req, ['PUT'])
    await withUser(req, res)
    const { id, status } = req.query

    if (status == 'read')
      await markAppNotificationRead(String(id))
    else
      await markAppNotification(String(id), String(status) as AppNotificationStatusType)

    return res.status(200).send(ApiResponse({ success: true }))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
