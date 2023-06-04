import {
  EventUser,
  GroupEvent,
  Message,
  Page,
  PageContent,
  Notification,
  UserNotification,
  Promo,
  Question,
  Rating,
  Room,
  RoomEvent,
  Site,
  Survey,
  SurveyAnswer,
  SurveyQuestion,
  User,
  UserAccount,
  UserBuddy,
  UserShare,
  UserEmailEvent,
  UserFile,
  NotificationUser,
  UserPhoto,
  UserSession,
  UserVerificationToken,
  UserBillingEvent,
} from 'lib/models'

export type DirectusCollection = {
  collection: string
  icon?: string
  note?: string
  display_template?: string
  hidden: boolean
  singleton: boolean
  translations?: unknown
  archive_field?: string
  archive_app_filter: boolean
  archive_value?: string
  unarchive_value?: string
  sort_field?: string
  accountability?: string
  color?: string
  item_duplication_fields?: unknown
  sort?: number
  group?: string | DirectusCollection
  collapse: string
}

export type DirectusField = {
  id: number
  collection: string | DirectusCollection
  field: string
  special?: unknown
  interface?: string
  options?: FieldOptions
  display?: string
  display_options?: unknown
  readonly: boolean
  hidden: boolean
  sort?: number
  width?: string
  translations?: unknown
  note?: string
  conditions?: unknown
  required?: boolean
  group?: string | DirectusField
  validation?: unknown
  validation_message?: string
  meta?: {
    id: number
    field: string
    options?: {
      choices?: FieldOptions
    }
    display: string
    display_options: {
      choices?: FieldOptions
    }
    note: 'string'
  }
}

export type FieldOption<T = string> = {
  text: string
  value: T
}

export type FieldOptions = FieldOption[]

export type DirectusFile = {
  id: string
  storage: string
  filename_disk?: string
  filename_download: string
  title?: string
  type?: string
  folder?: string | DirectusFolder
  uploaded_by?: string | DirectusUser
  uploaded_on: string
  modified_by?: string | DirectusUser
  modified_on: string
  charset?: string
  filesize?: number
  width?: number
  height?: number
  duration?: number
  embed?: string
  description?: string
  location?: string
  tags?: unknown
  metadata?: unknown
}

export type DirectusFolder = {
  id: string
  name: string
  parent?: string | DirectusFolder
}

export type DirectusUser = {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  location?: string
  title?: string
  description?: string
  tags?: unknown
  avatar?: string | DirectusFile
  language?: string
  theme?: string
  tfa_secret?: string
  status: string
  token?: string
  last_access?: string
  last_page?: string
  provider: string
  external_identifier?: string
  auth_data?: unknown
  email_notifications?: boolean
}

export type FieldMap = Record<string, DirectusField>

export type DirectusTypes = {
  events: GroupEvent
  events_users: EventUser
  location: Location
  notifications: Notification
  notifications_users: NotificationUser
  user_notifications: UserNotification
  page: Page
  promos: Promo
  page_content: PageContent
  site: Site
  surveys: Survey
  survey_questions: Question
  survey_survey_questions: SurveyQuestion
  survey_answers: SurveyAnswer
  user_account: UserAccount
  user_session: UserSession
  user_billing_events: UserBillingEvent
  user_verification_token: UserVerificationToken
  user_email_events: UserEmailEvent
  user_buddy: UserBuddy
  user_shares: UserShare
  users: User
  users_files: UserFile
  users_photos: UserPhoto
  rating: Rating
  rooms: Room
  room_events: RoomEvent
  messages: Message
  directus_collections: DirectusCollection
  directus_fields: DirectusField
  directus_files: DirectusFile
  directus_folders: DirectusFolder
  directus_users: DirectusUser
}
