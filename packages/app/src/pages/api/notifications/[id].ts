import {
  getNotificationUser,
  updateNotificationUser
} from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withUser
} from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getUserNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType>
) {
  try {
    const method = withMethods(req, ['GET', 'DELETE', 'PUT'])
    const user = await withUser(req, res)
    const { id: i } = req.query
    const id = Number(i)


    let notification = await getNotificationUser(id)
    if (notification.user_id as string !== user.id) throw new Error('Unauthorized')

    switch (method) {
      case 'GET': {
        notification = await updateNotificationUser(id, { read: true })
        return res.status(200).send(ApiResponse(notification))
      }
      case 'DELETE':
        notification = await updateNotificationUser(id, { status: 'deleted' })
        return res.status(200).send(ApiResponse({ success: true }))
      case 'PUT': {
        notification = await updateNotificationUser(id, req.body)
        return res.status(200).send(ApiResponse(notification))
      }
    }
    return res.status(405).json(ApiResponse(null, 'Method Not Allowed'))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
