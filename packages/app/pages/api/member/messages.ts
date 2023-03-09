import { pruneUndefined } from './../../../lib/utils/index'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, User, UserMessages } from 'lib/models'
import {
  updateMessage,
  getMessages,
  sendMessage,
} from 'lib/services/directus/server/users/messages'
import { withMethods, withUser } from 'lib/utils/server'

export default async function getUserMessages(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserMessages>>
) {
  let messages: UserMessages = {}
  try {
    const method = withMethods(req, ['GET', 'POST', 'PUT'])
    const user = await withUser(req, res)
    const { id: i, body: c, to: t, status: s } = req.query
    const id = i ? String(i) : null
    const to = t ? String(t) : null
    const body = c ? String(c) : null
    const status = s ? String(s) : null
    switch (method) {
      case 'GET':
        messages = await getMessages(user.id)
        return res.status(200).json(ApiResponse(messages))

      case 'POST':
        await sendMessage({
          id,
          from: user.id,
          to,
          body,
        })
        messages = await getMessages(user.id)
        return res.status(200).json(ApiResponse(messages))

      case 'PUT':
        if (id) await updateMessage(id, pruneUndefined({ status, body }))
        messages = await getMessages(user.id)
        return res.status(200).json(ApiResponse(messages))

      default:
        return res.status(404).end()
    }
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(messages))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
