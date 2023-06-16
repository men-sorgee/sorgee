import { ApiResponse, Rating, RatingCollection } from 'lib/models'
import { getRating, setRating } from 'lib/services/directus/server/users'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function MemberItemRating(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Rating>>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)
    const { collection: c, item: i } = req.query
    const collection = String(c) as RatingCollection
    const item = String(i)

    switch (method) {
      case 'GET': {
        const rating = await getRating(member.id, collection, item)

        return res.status(200).json(ApiResponse(rating))
      }
      case 'POST': {
        const { rate } = req.body
        const rating = await setRating(member.id, collection, item, rate)
        return res.status(200).json(ApiResponse(rating))
      }
    }

    return res.status(200).json(ApiResponse(null, 'No data'))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, e))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
