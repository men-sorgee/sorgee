import { User, UserType } from "./users";

export type AppNotification = Omit<
  Notification,
  'id' | 'status' | 'users' | 'data' | 'template'
> & {
  id: number
  status: AppNotificationStatusType
  read: boolean
}

export type AppNotificationStatusType =
  | 'new'
  | 'sent'
  | 'deleted'
  | 'open'
  | 'click'
  | 'delivered'

export type Notification = {
  id: string
  status: 'ready' | 'draft'
  date_created?: string
  link?: string
  subject?: string
  send_email?: boolean
  app_notification?: boolean
  button_url?: string
  button_text?: string
  message?: string
  category?: string
  visibility: UserType[]
  body?: string
  date_sent?: string
  template?: string
  users: string | NotificationUser[]
  data: Record<string, any>
  static: boolean
}

export type NotificationUser = {
  id: number
  notification_id?: string | Notification
  user_id?: string | User
  status: AppNotificationStatusType
  email_events?: string[] | UserEmailEvent[]
  read: boolean
}


export type UserNotification = {
  id: string
  read: boolean
  date_created?: string
  user_id?: string | User
  message?: string
  button_text?: string
  button_url?: string
  icon?: string
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
  notification_id?: number
}
