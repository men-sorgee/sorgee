import { NextApiRequest, NextApiResponse } from 'next'
import { updateUser } from '@/lib/services/directus/server/users'
import { withMethods, withMember } from 'lib/utils/server'
import { User, Applicant, ApiResponse } from '@/lib/models'

export default async function getUserDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)

    switch (method) {
      case 'GET':
        return res.status(200).json(ApiResponse(member))

      case 'POST':
        const userDetails = req.body as Partial<User>
        updateUser(member.id, userDetails)
        return res.status(200).json(ApiResponse(null))

      default:
        return res.status(200).end()
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
