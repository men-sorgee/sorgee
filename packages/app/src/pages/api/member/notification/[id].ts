import { ApiResponse } from 'lib/models'
import { deleteUserNotification, markUserNotificationRead } from 'lib/services/directus/server'
import { withMethods, withUser } from 'lib/utils/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function getUserNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const method = withMethods(req, ['DELETE', 'PUT'])
    await withUser(req, res)
    const { id } = req.query
    switch (method) {
      case 'PUT':
        await markUserNotificationRead(String(id))
        return res.status(200).end()

      case 'DELETE':
        await deleteUserNotification(String(id))
        return res.status(200).end()

      default:
        return res.status(404).end()
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
