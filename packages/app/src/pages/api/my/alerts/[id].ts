
import {
  deleteUserNotification,
  getUserNotification,
  markUserNotificationRead
} from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withUser
} from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';
export default async function PutUserNotification(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType>
) {
  try {
    const method = withMethods(req, ['PUT', 'DELETE'])
    const member = await withUser(req, res)
    const { id } = req.query
    const notificationId = String(id)

    const notification = await getUserNotification(notificationId)
    if (notification.user_id !== member.id)
      throw new Error('Unauthorized')

    switch (method) {
      case 'PUT':
        await markUserNotificationRead(notificationId)
        break
      case 'DELETE':
        await deleteUserNotification(notificationId)
        break
    }

    return res.status(200).end()

  } catch (e) {
    console.dir({
      query: req.query,
    })
    if (e.message == 'Unauthorized')
      return res.status(403).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
