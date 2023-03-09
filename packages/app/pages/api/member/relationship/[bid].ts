import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods, withMember } from 'lib/utils/server'
import { ApiResponse, UserRelationship } from 'lib/models'
import {
  getUser,
  getRelationship,
  setRelationship,
  removeRelationship,
} from 'lib/services/directus/server/users'

export default async function MemberImage(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserRelationship> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE', 'GET'])
    const me = await withMember(req, res)

    const { bid } = req.query
    const user_id = String(bid)

    const them = await getUser(user_id)
    if (!them) {
      res.status(404).json(ApiResponse(null, 'Not Found'))
    }

    switch (method) {
      case 'GET': {
        const relation = await getRelationship(me.id, them.id)
        return relation
          ? res.status(200).json(ApiResponse(relation))
          : res.status(404).json(ApiResponse(null, 'Not Found'))
      }
      case 'POST': {
        const { relation } = req.body
        console.dir({
          me: me.id,
          them: them.id,
          relation,
        })
        let relationship = await setRelationship(me.id, them.id, relation)

        return res.status(200).json(ApiResponse(relationship))
      }

      case 'DELETE': {
        await removeRelationship(me.id, them.id)
        return res.status(200).json(ApiResponse('ok'))
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
