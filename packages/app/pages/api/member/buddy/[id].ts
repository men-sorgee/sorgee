import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods, withMember } from 'lib/utils/server'
import { ApiResponse, UserBuddy } from 'lib/models'
import { getUser, getBuddy, addBuddy, removeBuddy } from 'lib/services/directus/server/users'
import { addUserNotification } from 'lib/services/directus/server'

export default async function MemberBuddy(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserBuddy> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE', 'GET'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getUser(user_id)
    if (them == null) {
      res.status(404).json(ApiResponse(null, 'Not Found'))
    }

    switch (method) {
      case 'GET': {
        const buddy = await getBuddy(me.id, them.id)
        return buddy
          ? res.status(200).json(ApiResponse(buddy))
          : res.status(200).json(ApiResponse(null))
      }
      case 'POST': {
        const buddy = await addBuddy(me.id, them.id)

        if (them.buddies?.some(b => b.buddy_id == me.id)) {
          // send mutual buddy notification
          await addUserNotification({
            user_id: them.id,
            message: `A buddy of yours added you to their buddy list!`,
            button_text: 'View Profile',
            button_url: `/member/${me.id}`
          })
        }

        return res.status(200).json(ApiResponse(buddy))
      }
      case 'DELETE': {
        await removeBuddy(me.id, them.id)
        return res.status(200).json(ApiResponse('ok'))
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
