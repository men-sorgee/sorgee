import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods, withMember } from 'lib/utils/server'
import { ApiResponse, UserBuddy } from 'lib/models'
import { getUser, getBuddy, addBuddy, removeBuddy } from 'lib/services/directus/server/users'

export default async function MemberBuddy(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserBuddy> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE', 'GET'])
    const me = await withMember(req, res)

    const { bid } = req.query
    const user_id = String(bid)

    console.log('Member Buddy', method, user_id)

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
