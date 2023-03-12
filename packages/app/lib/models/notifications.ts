import { UserType, NotificationStatusType, User } from './users'

export type AppNotification = Omit<
  Notification,
  'id' | 'status' | 'users' | 'data' | 'template'
> & {
  id: number
  status: NotificationStatusType
}

export type Notification = {
  id: string
  status: 'ready' | 'draft'
  date_created?: string
  link?: string
  subject?: string
  send_email?: boolean
  app_notification?: boolean
  button_link?: string
  button_text?: string
  message?: string
  category?: string
  visibility: UserType[]
  body?: string
  date_sent?: string
  template?: string
  users: string | UserNotification[]
  data: any
  static: boolean
}

export type UserNotification = {
  id: number
  notification_id?: string | Notification
  user_id?: string | User
  status: NotificationStatusType
  email_events?: string[] | UserEmailEvent[]
}

export type UserEmailEvent = {
  id?: string
  date_created?: string
  payload?: Record<string, unknown>
  event?: string
  marketing_campaign_name?: string
  marketing_campaign_id?: string
  email?: string
  category?: string
  sg_event_id?: string
  sg_message_id?: string
  timestamp?: number
  response?: string
  url?: string
  type?: string
  user?: string | User
  status?: string
  notification_id?: string
}
