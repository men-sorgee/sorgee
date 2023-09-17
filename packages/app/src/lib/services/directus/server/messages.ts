import {
  ChatMessage,
  ChatUser,
  Message,
  MessageStatusType,
  User
} from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

export async function getMessages(user_id: string) {
  const adminClient = await getAdminClient()
  const { data: messages = [] } = await adminClient.items('messages').readByQuery({
    filter: {
      status: {
        _neq: 'archived',
      },
      date_created: {
        _gt: '$NOW(-30d)',
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
      'from.id',
      'from.picture',
      'from.nickname',
      'from.presence',
      'from.last_login',
      'to.id',
      'to.picture',
      'to.nickname',
      'to.presence',
      'to.last_login',
      'image.id',
    ] as any,
  })

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

export async function sendMessage(message: Partial<Message>) {
  const admin = await getAdminClient()
  return (await admin.items('messages').createOne(message)) as unknown as Message
}

export async function getMessage(id: string) {
  const admin = await getAdminClient()
  return (await admin.items('messages').readOne(id)) as unknown as Message
}

export async function updateMessage(id: string, message: Partial<Message>) {
  const admin = await getAdminClient()
  if (message.body) message.status = 'edited'
  return (await admin.items('messages').updateOne(id, message)) as unknown as Message
}

export async function markAs(ids: string[], status: MessageStatusType) {
  const admin = await getAdminClient()
  await admin.items('messages').updateMany(ids, {
    status,
  })
}
