import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, AppNotification } from 'lib/models'
import { markNotification, getNotifications } from '@/lib/services/directus/server/notifications'

import { withMethods, withUser } from 'lib/utils/server'

export default async function getUserNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'PUT'])
    const user = await withUser(req, res)
    let notifications: AppNotification[] = []
    switch (method) {
      case 'GET':
        notifications = await getNotifications(user.id)
        return res.status(200).json(ApiResponse(notifications))

      case 'PUT':
        const { id, state } = req.body
        if (id) await markNotification(id, state)
        return res.status(200).json(ApiResponse(null))

      default:
        return res.status(404).end()
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
