import { baseUrl } from "lib/config";
import { Member, UserLike } from "lib/models";
import { addAlert } from "lib/services/directus/server";
import {
  addLike,
  getLike,
  getUser,
  removeLike
} from "lib/services/directus/server/users";
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail
} from "lib/services/sendgrid/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function MemberLike(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<UserLike> | ApiResponseType>
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
        const like = await getLike(me.id, them.id)
        res.setHeader('Cache-Control', 'cache, store, max-age=30')
        return like
          ? res.status(200).json(ApiResponse(like))
          : res.status(200).json(ApiResponse(null))
      }
      case 'POST': {
        const like = await addLike(me.id, them.id)


        let title = `You have a new like!`
        let myName = me.nickname || me.first_name
        let message = `${myName} likes you!`
        let action = `View ${myName}'s Profile`

        if (them.likes.some((b: UserLike) => b.like_id == me.id)) {
          title = `You have a new match!`
          message = `${myName} likes you back!`
        }

        await addAlert(them.id, {
          message,
          button_text: action,
          button_url: `/member/${me.id}`,
          icon: 'success'
        })

        await sendNotificationEmail(
          them.email,
          them.nickname || them.first_name,
          title,
          message,
          {
            user_id: them.id,
            button_text: action,
            button_url: `${baseUrl}/member/${me.id}`,
          },
          SendGridTemplate.Notification,
          SendGridCategory.Notification
        )


        return res.status(200).json(ApiResponse(like))
      }
      case 'DELETE': {
        await removeLike(me.id, them.id)
        return res.status(200).json(ApiResponse('ok'))
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
