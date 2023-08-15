import { baseUrl } from "lib/config";
import { UserBuddy } from "lib/models";
import { addUserNotification } from "lib/services/directus/server";
import {
  addBuddy,
  getBuddy,
  getUser,
  removeBuddy
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

export default async function MemberBuddy(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<UserBuddy> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE', 'GET'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getUser(user_id)
    if (them == null) {
      res.status(404).json(ApiResponse(null, 'Not Found'))
    }

    switch (method) {
      case 'GET': {
        const buddy = await getBuddy(me.id, them.id)
        res.setHeader('Cache-Control', 'cache, store, max-age=30')
        return buddy
          ? res.status(200).json(ApiResponse(buddy))
          : res.status(200).json(ApiResponse(null))
      }
      case 'POST': {

        let myName = me.nickname || me.first_name
        let title = `${myName} added you to their buddy list`
        let action = `View ${myName}'s Profile`

        const buddy = await addBuddy(me.id, them.id)

        if (them.buddies?.some((b) => b.buddy_id == me.id)) {
          title = `Your buddy ${myName} added you to their buddy list!`
        }

        // send notification
        await addUserNotification(them.id, {
          message: title,
          button_text: action,
          button_url: `/member/${me.id}`,
        })

        // send email
        await sendNotificationEmail(
          them.email,
          them.first_name,
          title,
          `${myName} has added you to their buddy list! Click the button below to view their profile.`,
          {
            button_text: 'View Profile',
            button_url: `${baseUrl}/member/${me.id}`,
            user_id: them.id,
          },
          SendGridTemplate.Notification,
          SendGridCategory.Notification
        )

        return res.status(200).json(ApiResponse(buddy))
      }
      case 'DELETE': {
        await removeBuddy(me.id, them.id)
        return res.status(200).json(ApiResponse('ok'))
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
