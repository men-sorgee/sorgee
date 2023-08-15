
import { MemberLevel, UserBuddy } from "lib/models";
import {
  addUserNotification,
  addUserToCongratsEmail,
  getMember,
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
    const method = withMethods(req, ['POST', 'GET', 'DELETE'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getUser(user_id)

    switch (method) {
      case 'GET': {
        res.setHeader('Cache-Control', 'cache, store, max-age=30')
        if (them.vouched_by) {
          const voucher = await getMember(them.vouched_by as string)
          const { id, nickname, picture } = voucher || {}
          return res.status(200).json(ApiResponse({ id, nickname, picture }))
        } else {
          return res.status(200).json(ApiResponse({ id: undefined }))
        }
        break
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
        })

        return res.status(200).json(
          ApiResponse({
            id: me.id,
            nickname: me.nickname,
            picture: me.picture,
          })
        )
        break
      }
      case 'DELETE': {
        if (them == null || them.user_type != 'pledge' || them.vouched_by != undefined) {
          throw new Error('Not Found')
        }
        if (MemberLevel[me.user_type] < MemberLevel.brother) {
          throw new Error('Unauthorized')
        }

        const { reason: r } = req.body
        const reason = String(r)

        await updateUser(user_id, {
          application_status: 'denied',
          notes: `${them.notes}\nPledge denied by ${me.email} for: ${reason}`,
          user_type: 'applicant',
        })

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
