import { DirectusUser } from './directus'
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

export type UserMessages = Record<string, Message[]>

export type Conversation = {
  id: string
  messages: Message[]
  hasNewMessages: boolean
  newMessageCount: number
  lastMessage: Message
  user: ChatUser
}
export type ChatUser = {
  id: string
  nickname: string
  picture: string
  last_login: string
  presence: string
}
export type MessageStatusType = 'new' | 'read' | 'archived'
export type Message = {
  id: string
  status: string | MessageStatusType
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  to: string | User
  from: string | User
  expires?: string
  body: string
  edited: boolean
  user?: ChatUser
  direction: 'incoming' | 'outgoing'
}
