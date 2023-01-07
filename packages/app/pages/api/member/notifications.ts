import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, AppNotification } from 'lib/models'
import {
  markNotification,
  getNotifications,
} from 'lib/services/directus/server/users/notifications'

import { withMethods, withMember } from 'lib/utils/server'

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  try {
    const method = withMethods(req, ['GET', 'PUT'])
    const member = await withMember(req, res)
    let notifications: AppNotification[] = []
    switch (method) {
      case 'GET':
        notifications = await getNotifications(member.id)
        return res.status(200).json(ApiResponse(notifications))

      case 'PUT':
        const { id, state } = req.body
        if (id) await markNotification(id, state)
        return res.status(200).json(ApiResponse(null))

      default:
        return res.status(404).end()
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

export default handler
