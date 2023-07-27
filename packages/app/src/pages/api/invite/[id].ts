import { ApiResponse, EventUser, MemberLevel, UserType } from 'lib/models'
import {
  getInvite,
  getUser,
  updateInvite,
  updateUser,
} from 'lib/services/directus/server'
import { withMethods, withStaff } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { sendCongratsEmail } from 'lib/services/sendgrid/server'

export default async function Invite(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventUser> | null>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    await withStaff(req, res)
    const { id } = req.query

    if (id == undefined) {
      return res.status(404).json(ApiResponse(null, 'Not found'))
    }

    const invite_id = Number(id)
    const invite = await getInvite(invite_id)
    if (!invite) {
      return res.status(404).json(ApiResponse(null, 'Not invited'))
    }

    switch (method) {
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

        let { user_type, rating } = attendee

        // if they are an inductee or pledge, make them a brother
        if (MemberLevel[attendee.user_type] < MemberLevel.brother) {
          user_type = 'brother'
          rating = 5
        }

        await updateUser(user_id, {
          signed_waiver,
          user_type,
          status: 'active',
        })

        if (MemberLevel[attendee.user_type] < MemberLevel.brother) {
          await sendCongratsEmail(attendee.email, attendee.first_name, user_type)
        }
    }

    res.status(200).json(ApiResponse(invite))
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
