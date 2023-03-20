import { pruneUndefined } from './../../../lib/utils/index'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Message, User, UserMessages, MessageStatusType } from 'lib/models'
import {
  updateMessage,
  getMessages,
  sendMessage,
  getMessage,
  markAs,
} from '@/lib/services/directus/server/messages'
import { withMethods, withUser } from 'lib/utils/server'

export default async function getUserMessages(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserMessages | Message>>
) {
  let messages: UserMessages = {}
  let message: Message = {} as any
  try {
    const method = withMethods(req, ['GET', 'POST', 'PUT'])
    const user = await withUser(req, res)
    const { body: c, to: t, status: s, ids: messageIds } = req.body
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
          messages = await getMessages(user.id)
          return res.status(200).json(ApiResponse(messages))
        }

      case 'POST':
        message = await sendMessage({
          from: user.id,
          to,
          body,
        })
        return res.status(200).json(ApiResponse(message))

      case 'PUT':
        if (id) {
          message = await updateMessage(id, pruneUndefined({ status, body }))
          return res.status(200).json(ApiResponse(message))
        } else if (ids) {
          await markAs(ids, status)
          messages = await getMessages(user.id)
          return res.status(200).json(ApiResponse(messages))
        }

      default:
        return res.status(404).end()
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(messages))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
