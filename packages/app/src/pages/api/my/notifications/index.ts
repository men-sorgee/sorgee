import { ApiResponse, UserNotification } from 'lib/models'
import { withUser } from 'lib/utils/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getUserNotifications } from 'lib/services/directus/server/notifications'

export default async function GetUserNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const user = await withUser(req, res)
    let notifications: UserNotification[] = await getUserNotifications(user.id)
    return res.status(200).json(ApiResponse(notifications))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
