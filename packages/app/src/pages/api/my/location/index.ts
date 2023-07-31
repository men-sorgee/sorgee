import { ApiResponse } from 'lib/models'
import { updateUser } from 'lib/services/directus/server/users'
import { withMember } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Location(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const member = await withMember(req, res)
    const { coordinates } = req.body
    updateUser(member.id, { location: { type: "Point", coordinates } })

    res.status(200).send(ApiResponse(true))
  } catch (e) {
    if (e.message == 'Unauthorized') {
      return res.status(200).json(ApiResponse([]))
    }
    console.error(e)
    res.status(401).json(ApiResponse(null, e))
  }
}
