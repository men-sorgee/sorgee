import {
  ApiResponse,
  Member,
  UserBlock,
} from 'lib/models'
import {
  addBlock,
  getBlock,
  getUser,
  removeBlock,
} from 'lib/services/directus/server/users'
import {
  withMember,
  withMethods,
} from 'lib/utils/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function MemberBlock(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserBlock> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE', 'GET'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getUser<Member>(user_id)
    if (them == null) {
      res.status(404).json(ApiResponse(null, 'Not Found'))
    }

    switch (method) {
      case 'GET': {
        const block = await getBlock(me.id, them.id)
        return block
          ? res.status(200).json(ApiResponse(block))
          : res.status(200).json(ApiResponse(null))
      }
      case 'POST': {
        const block = await addBlock(me.id, them.id)

        return res.status(200).json(ApiResponse(block))
      }
      case 'DELETE': {
        await removeBlock(me.id, them.id)
        return res.status(200).json(ApiResponse('ok'))
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
