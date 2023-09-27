import { baseUrl } from "lib/config";
import { Message, MessageStatusType, UserMessages } from "lib/models";
import { getMember } from "lib/services/directus/server";
import {
  getMessage,
  getMessages,
  markAs,
  sendMessage,
  updateMessage
} from "lib/services/directus/server/messages";
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail
} from "lib/services/sendgrid/server";
import { pruneUndefined } from "lib/utils/index";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withUser
} from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getUserMessages(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<UserMessages | Message>>
) {
  let messages: UserMessages = {}
  let message: Message = {} as any
  try {
    const method = withMethods(req, ['GET', 'POST', 'PUT'])
    const me = await withUser(req, res)
    const { body: c, to: t, status: s, ids: messageIds, type } = req.body
    const { id: i } = req.query
    let id = i ? String(i) : null
    let ids: string[] = null
    if (Array.isArray(messageIds)) ids = Array.from(messageIds)

    const to = t ? String(t) : null
    const body = c ? String(c) : null
    const status = (s ? String(s) : null) as MessageStatusType
    switch (method) {
      case 'GET':
        if (id) {
          message = await getMessage(id)
          return res.status(200).json(ApiResponse(message))
        } else {
          messages = await getMessages(me.id)
          return res.status(200).json(ApiResponse(messages))
        }

      case 'POST':
        const them = await getMember(to)
        if (them == null) throw new Error('User not found')
        if (me.user_type != "staff") {
          if (them.allow_messages == "none") {
            throw new Error('User does not allow messages')
          } else if (them.allow_messages == "buddies" && !them.buddies?.some((f) => f.buddy_id == me.id)) {
            throw new Error('User does not allow messages from non-buddies')
          } else if (them.allow_messages == "staff") {
            throw new Error('User does not allow messages from non-staff')
          }
        }

        message = await sendMessage({
          from: me.id,
          to,
          body,
          type,
        })

        if (them.presence != "online") {
          let myName = me.nickname || me.first_name
          await sendNotificationEmail(
            them.email,
            them.first_name,
            `${myName} has sent you a message`,
            `From ${myName}:\n> \`${body}\``,
            {
              button_text: 'View Message',
              button_url: `${baseUrl}/members/chat/${me.id}`,
              user_id: them.id
            },
            SendGridTemplate.Notification,
            SendGridCategory.Notification
          )
        }

        return res.status(200).json(ApiResponse(message))

      case 'PUT':
        if (id) {
          message = await updateMessage(id, pruneUndefined({ status, body }))
          return res.status(200).json(ApiResponse(message))
        } else if (ids) {
          await markAs(ids, status)
          messages = await getMessages(me.id)
          return res.status(200).json(ApiResponse(messages))
        }

      default:
        return res.status(404).json(ApiResponse(null, 'Not found'))
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(messages))
    console.error(e.message || e, e.stack)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}
