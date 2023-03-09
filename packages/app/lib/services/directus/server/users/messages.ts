import { getAdminClient } from '..'
import { Message, UserMessages, MessageStatusType, User, ChatUser } from 'lib/models'

export async function getMessages(user_id: string): Promise<UserMessages> {
  const adminClient = await getAdminClient()
  const { data: messages = [] } = await adminClient.items('messages').readByQuery({
    filter: {
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
    sort: ['-date_created'],
    limit: 100,
    fields: [
      '*',
      'from.id',
      'from.picture',
      'from.nickname',
      'from.online_status',
      'from.last_login',
      'to.id',
      'to.picture',
      'to.nickname',
      'to.online_status',
      'to.last_login',
    ] as any,
  })

  const userMessages: Record<string, Message[]> = {}
  messages.forEach((message: Message) => {
    let { from, to } = message as { to: User; from: User }
    message.user = (from.id === user_id ? to : from) as ChatUser
    message.direction = from.id === user_id ? 'outgoing' : 'incoming'
    const key = message.user.id
    if (!userMessages[key]) {
      userMessages[key] = []
    }
    userMessages[key].push(message)
  })

  return userMessages
}

export async function sendMessage(message: Partial<Message>) {
  const admin = await getAdminClient()
  admin.items('messages').createOne(message)
}

export async function updateMessage(id: string, message: Partial<Message>) {
  const admin = await getAdminClient()
  admin.items('messages').updateOne(id, message)
}
