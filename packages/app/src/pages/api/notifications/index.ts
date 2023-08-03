import { AppNotification } from 'lib/models'
import { ApiResponse } from 'lib/utils'
import { withMethods, withUser } from 'lib/utils/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getAppNotifications } from 'lib/services/directus/server/notifications'

export default async function AppNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    withMethods(req, ['GET'])
    const user = await withUser(req, res)
    let notifications: AppNotification[] = []

    notifications = await getAppNotifications(user.id)
    return res.status(200).json(ApiResponse(notifications))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(401).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}
