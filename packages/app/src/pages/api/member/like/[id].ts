import { ApiResponse, Member, UserLike } from 'lib/models'
import { addUserNotification } from 'lib/services/directus/server'
import { addLike, getLike, getUser, removeLike } from 'lib/services/directus/server/users'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
} from 'lib/services/sendgrid/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

import { baseUrl } from '../../../../lib/config'

export default async function MemberLike(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserLike> | ApiResponse>
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

        await sendNotificationEmail(
          them.email,
          them.nickname || them.first_name,
          `You have a new like!`,
          `${me.nickname || me.first_name} likes you!`,
          {
            user_id: them.id,
            button_text: `View Their Profile`,
            button_url: `${baseUrl}/members/${me.id}`,
          },
          SendGridTemplate.AppNotification,
          SendGridCategory.Notification
        )

        if (them.likes.some((b: UserLike) => b.like_id == me.id)) {
          // send mutual like notification
          await addUserNotification({
            user_id: them.id,
            message: `Someone your like, likes you too!`,
            button_text: `View Their Profile`,
            button_url: `/member/${me.id}`,
          })
        }

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
