import {
  ChatMessage,
  ChatUser,
  Message,
  MessageStatusType,
  User
} from "lib/models";

import {
  createItem,
  readItem,
  readItems,
  updateItem,
  updateItems
} from "@directus/sdk";

import { getAdminClient } from "./";

export async function getMessages(user_id: string): Promise<Record<string, ChatMessage[]>> {
  const admin = getAdminClient()
  const messages = await admin.request<Message[]>(readItems('messages', {
    filter: {
      status: {
        _neq: 'archived',
      },
      _or: [
        {
          to: {
            _eq: user_id,
          },
        },
        {
          from: {
            _eq: user_id,
          },
        },
      ],
    },
    sort: ['date_created'],
    limit: -1,
    fields: [
      '*',
      { from: ['id', 'picture', 'nickname', 'presence', 'last_login'] },
      { to: ['id', 'picture', 'nickname', 'presence', 'last_login'] },
      { image: ['id', 'title'] }
    ],
  }))

  const userMessages: Record<string, ChatMessage[]> = {}

  messages.forEach((message: Message) => {
    let { from, to, image } = message as { to: User; from: User; image: string }
    const user = (from.id === user_id ? to : from) as ChatUser
    const direction = from.id === user_id ? 'outgoing' : 'incoming'
    const { body, status, date_created, edited, expires, type } = message
    const key = user.id
    if (!userMessages[key]) {
      userMessages[key] = []
    }
    userMessages[key].push({
      id: message.id,
      status,
      timestamp: new Date(date_created),
      edited,
      body,
      image,
      expires,
      user,
      direction,
      type,
    } as ChatMessage)
  })

  return userMessages
}

export async function sendMessage(message: Partial<Message>): Promise<Message> {
  const admin = getAdminClient()
  return admin.request<Message>(createItem('messages', message))
}

export async function getMessage(id: string): Promise<Message> {
  const admin = getAdminClient()
  return admin.request<Message>(readItem('messages', id))
}

export async function updateMessage(id: string, message: Partial<Message>): Promise<Message> {
  const admin = getAdminClient()
  if (message.body) message.status = 'edited'
  return admin.request<Message>(updateItem('messages', id, message))
}

export async function markAs(ids: string[], status: MessageStatusType): Promise<void> {
  const admin = getAdminClient()
  await admin.request<Message[]>(updateItems('messages', ids, { status }))
}
