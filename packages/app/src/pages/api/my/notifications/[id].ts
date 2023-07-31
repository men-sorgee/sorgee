
import { ApiResponse } from 'lib/models'
import { withMethods, withUser } from 'lib/utils/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteUserNotification, getUserNotification, markUserNotificationRead } from 'lib/services/directus/server'

export default async function PutUserNotification(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const method = withMethods(req, ['PUT', 'DELETE'])
    const member = await withUser(req, res)
    const { id } = req.query

    const notification = await getUserNotification(id as string)
    if (notification.user_id !== member.id)
      throw new Error('Unauthorized')

    switch (method) {
      case 'PUT':
        await markUserNotificationRead(id as string)
        break
      case 'DELETE':
        await deleteUserNotification(id as string)
        break
    }

    return res.status(200).end()

  } catch (e) {
    if (e.message == 'Unauthorized')
      return res.status(403).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
