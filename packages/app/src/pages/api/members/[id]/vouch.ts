
import { MemberLevel, User, UserBuddy } from "lib/models";
import {
  addUserNotification,
  addUserToCongratsEmail,
  getUser,
  updateUser
} from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function VouchForMember(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<UserBuddy> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['POST', 'GET', 'PUT'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)


    if (!user_id) throw new Error('Member ID missing')

    const them = await getUser(user_id, [
      'id',
      'nickname',
      'user_type',

      'vouched_by.id',
      'vouched_by.nickname',
      'vouched_by.picture',
    ])
    if (!them) throw new Error('Pledge not found')

    switch (method) {
      case 'GET': {
        res.setHeader('Cache-Control', 'cache, store, max-age=30')
        if (them.vouched_by) {
          const voucher = them.vouched_by as Partial<User>
          const { id, nickname, picture } = voucher || {}
          return res.status(200).json(ApiResponse({ id, nickname, picture }))
        } else {
          return res.status(200).json(ApiResponse({ id: undefined }))
        }
      }
      case 'POST': {
        if (them == null || them.user_type != 'pledge' || them.vouched_by != undefined)
          throw new Error('Not Found')

        if (MemberLevel[me.user_type] < MemberLevel.brother)
          throw new Error('Unauthorized')

        await updateUser(user_id, {
          vouched_by: me.id,
          user_type: 'inductee',
        })

        // send congrats email
        await addUserToCongratsEmail(user_id, 'inductee')

        await addUserNotification(them.id, {
          message: `You have been vouched for by ${me.nickname}!`,
          button_text: 'View Profile',
          button_url: `/member/${me.id}`,
          icon: 'success'
        })

        return res.status(200).json(
          ApiResponse({
            id: me.id,
            nickname: me.nickname,
            picture: me.picture,
          })
        )
      }
      case 'PUT': {
        if (them.user_type != 'pledge')
          throw new Error('Member is not a pledge: ' + them.user_type)
        if (them.vouched_by != null)
          throw new Error('Member is already vouched-for')


        if (MemberLevel[me.user_type] < MemberLevel.brother) {
          throw new Error('Unauthorized')
        }

        const { reason: r } = req.body
        const reason = String(r)

        await updateUser(user_id, {
          application_status: 'denied',
          notes: `${them.notes}\nPledge denied by ${me.email} for: ${reason}`,
          user_type: 'reject',
        })

        addUserToCongratsEmail

        return res.status(200).json(
          ApiResponse(null)
        )
      }
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
