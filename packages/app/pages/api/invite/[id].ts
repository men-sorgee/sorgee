import { NextApiRequest, NextApiResponse } from 'next'
import { getInvite, getUser, updateInvite, updateUser } from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { ApiResponse, EventUser, MemberLevel } from 'lib/models'

export default async function updateInviteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventUser> | null>
) {
  try {
    withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)
    const { id } = req.query
    console.log('id', id)
    if (id == undefined || !member || member.user_type != MemberLevel[MemberLevel.staff]) {
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))
    }
    const invite_id = Number(id)
    const invite = await getInvite(invite_id)
    if (!invite) {
      return res.status(404).json(ApiResponse(null, 'Not invited'))
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(ApiResponse(invite))
      case 'POST':
        let { user_id, paid, signed_waiver } = req.body
        user_id = String(user_id)
        paid = Boolean(paid)
        signed_waiver = Boolean(signed_waiver)
        const attendee = await getUser(user_id)
        if (!attendee) {
          return res.status(401).json(ApiResponse(null, 'User not found'))
        }

        await updateInvite(invite_id, { paid, attended: true })

        // if they are an inductee or pledge, make them a brother
        const user_type: string =
          MemberLevel[attendee.user_type] < MemberLevel[MemberLevel.brother]
            ? 'brother'
            : attendee.user_type
        await updateUser(user_id, {
          signed_waiver: signed_waiver,
          user_type,
          status: 'active',
        })
    }

    res.status(200).json(ApiResponse(invite))
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
