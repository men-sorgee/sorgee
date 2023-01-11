import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import {
  findInvite,
  getEvent,
  getInvite,
  updateInvite,
  updateUser,
} from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { ApiResponse, Applicant, MemberLevel } from 'lib/models'

export default async function updateInviteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse<ApiResponse>>
) {
  try {
    withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)

    const { id, user_id, attended, paid, signed_waiver } = req.body
    if (!id || !member || member.user_type != MemberLevel[MemberLevel.staff]) {
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))
    }
    await updateInvite(Number(id), { attended: Boolean(attended), paid: Boolean(paid) })
    await updateUser(String(user_id), { signed_waiver: Boolean(signed_waiver) })

    res.status(200).json(ApiResponse({}))
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
