import { Rating } from 'lib/models'
import { ApiResponse } from 'lib/utils'
import { getRatings } from 'lib/services/directus/server/users'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function MemberRatings(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Rating[]>>
) {
  try {
    withMethods(req, ['GET'])
    const member = await withMember(req, res)

    const ratings = await getRatings(member.id)

    return res.status(200).json(ApiResponse(ratings))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, e))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
