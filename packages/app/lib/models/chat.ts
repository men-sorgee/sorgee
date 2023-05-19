import { DirectusFile, DirectusUser } from './directus'
import { User } from './users'

export type Room = {
  id: string
  status: string
  sort?: number
  date_created?: string
  date_updated?: string
  name?: string
  url?: string
  user_count?: number
  metadata?: Record<string, any>
  events: RoomEvent[]
}
export type RoomEventType = 'Session Started' | ' Session Ended' | 'User Joined' | 'User Left'
export type RoomEvent = {
  id: string
  meetingId: Number
  type: RoomEventType & string
  payload?: Record<string, any>
  room?: Room
  created_at?: string
}

//export type UserMessages = Record<string, Message[]>

export type Conversation = {
  id: string
  status: 'active' | 'archived'
  date_created?: string
  date_updated?: string
  owner?: string | User
  messages: string | Message[]
}

export type ChatConversation = {
  id: string
  messages: ChatMessage[]
  hasNewMessages: boolean
  newMessageCount: number
  lastMessage: ChatMessage
  user: ChatUser
}
export type ChatUser = {
  id: string
  nickname: string
  picture: string
  last_login: string
  presence: string
}
export type MessageStatusType = 'new' | 'read' | 'edited' | 'archived'
export type MessageType = 'text' | 'image' | 'html'
export type MessageDirection = 'incoming' | 'outgoing'

export type ChatMessage = {
  id: string
  status: MessageStatusType
  timestamp: Date
  edited: boolean
  body: string
  image?: string
  expires?: string
  user: ChatUser
  direction: MessageDirection
  type: MessageType
}

export type UserMessages = Record<string, ChatMessage[]>

export type Message = {
  id?: string
  conversation: string | Conversation
  status: MessageStatusType
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  to: string | User
  from: string | User
  type: MessageType
  image?: string | DirectusFile
  expires?: string
  body: string
  edited?: boolean
  user?: ChatUser
  direction?: MessageDirection
}
