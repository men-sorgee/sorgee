import { Notification } from "lib/models";
import { getNotifications } from "lib/services/directus/server/notifications";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withUser
} from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Notifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType>
) {
  try {
    withMethods(req, ['GET'])
    const user = await withUser(req, res)
    let notifications: Notification[] = await getNotifications(user.id)
    return res.status(200).json(ApiResponse(notifications))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(401).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}
