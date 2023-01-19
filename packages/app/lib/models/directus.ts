import { UserStatusType } from 'lib/models'
import { Block } from 'editorjs-blocks-react-renderer'
import { ProviderType } from 'next-auth/providers'
import {
  ApplicationStatusType,
  ContactPreferenceType,
  NotificationStatusType,
  UserType,
} from './users'

export type Event = {
  id: string
  status: string
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  datetime?: string
  name?: string
  location?: string | Location
  description?: string
  users: string | EventUser[]
}
export type UserFields = (string | keyof User)[] | '*' | '*.*' | any

export type EventUser = {
  id: number
  events_id: string | Event
  users_id: string | User
  engagement?: unknown
  attended?: boolean
  flags?: unknown
  rsvp?: string
  paid?: boolean
  guest?: boolean
  reason?: string
  attendance: string
}

export type Location = {
  id: string
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  name?: string
  street?: string
  unit?: string
  city?: string
  state?: string
  zip?: string
  owner?: string | User
  notes?: string
  amenities?: unknown
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
  body?: string
  date_sent?: string
  template?: string
  users: string | UserNotification[]
}

export type UserNotification = {
  id: number
  notification_id?: string | Notification
  user_id?: string | User
  status: NotificationStatusType
}

export type Page = {
  id: string
  status: string
  user_created?: string
  date_created?: string
  user_updated?: string
  date_updated?: string
  title?: string
  description?: string
  slug?: string
  in_menu?: boolean
  image?: DirectusFile
  sort: number
  parent?: Page
  markdown?: string
  children: Page[]
  content: PageContent[]
  next_page?: Page
  next_page_params?: string
}

export type Promo = {
  id: number
  name: string
  description: string
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  code: string
  expires?: string
  override?: {
    site?: Partial<Site>
  }
  vouching_user?: string | User
}

export type PageContent = {
  id: string
  status: string
  sort?: number
  name?: string
  html?: string
  markdown?: string
  control?: { time: number; blocks: Block[]; version: string }
  image?: DirectusFile
  type?: string
  page?: Page
  columns: number
  container?: string
  container_classes?: string
}

export type Site = {
  id?: number
  site_title?: string
  invite_only?: boolean
  description?: string
}

export type UserAccount = {
  id?: string
  user?: string | User
  provider_id?: string
  provider?: string
  type?: ProviderType
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
  oath_token?: string
  oath_token_secret?: string
}

export type UserSession = {
  id: string
  expires?: string
  session_token?: string
  user?: string | User
}

export type UserVerificationToken = {
  id: string
  email: string
  token: string
  expires: string
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
}

export type UserRelationship = {
  id: number
  users_id: string | User
  related_users_id?: string | User
  relation: string
}

export type User = {
  id: string
  presence?: string
  status: string | UserStatusType
  date_created?: string
  date_updated?: string
  first_name: string
  last_name?: string
  user_type: string | UserType
  phone?: string
  phone_verified?: boolean
  email?: string
  email_verified?: boolean
  contact_preference: string | ContactPreferenceType
  weight?: number
  cock_length?: number
  build?: string
  cock_girth?: string
  cock_attributes?: string[]
  spectrum?: string
  relationship_status?: string
  skin_tone?: string
  photo?: string | DirectusFile
  notes?: string
  flags?: string[]
  birth_month: number
  birth_year: number
  age?: number
  mannerisms?: string
  height?: string
  nickname?: string
  last_login?: string
  vouched_by?: string | User
  needs_guidance?: boolean
  signed_waiver?: boolean
  biography?: string
  event_availability?: string[]
  sexual_scenes?: string[]
  my_positions?: string[]
  my_roles?: string[]
  their_spectrum?: string[]
  their_roles?: string[]
  their_relationship_status: string[]
  their_positions?: string[]
  body_hair?: string
  facial_hair?: string
  social_scenes?: string[]
  hair_color?: string
  hair_style?: string
  body_attributes?: string[]
  eye_color?: string
  ball_size?: string
  ball_gravity?: string
  city?: string
  cum_attributes?: string[]
  load_policy?: string[]
  hiv_status?: string
  last_tested?: string
  vaccinations?: unknown
  approved_by?: string | DirectusUser
  application_status: string | ApplicationStatusType
  in_sendgrid?: boolean
  picture?: string | DirectusFile
  video_consent?: boolean
  photo_consent?: boolean
  photo_denial_reason?: string
  tags?: string[]
  location?: string
  state: string
  events: string | EventUser[]
  my_files: string | UserPhoto[]
  email_events: string | UserEmailEvent[]
  images: string | UserFile[]
  users: string | UserRelationship[]
  accounts: string | UserAccount[]
  show_profile: boolean
  show_interests: boolean
  show_health: boolean
  event_invites: boolean
  can_host?: boolean
  can_host_events: string[] | ('sex' | 'social' | 'individual')[]
  promo: number | Promo
}

export type UserFile = {
  id: number
  users_id?: string | User
  directus_files_id?: string | DirectusFile
}

export type UserPhoto = {
  id: number
  users_id?: string | User
  directus_files_id?: string | DirectusFile
}

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
  options?: unknown
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
}

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

export type DirectusTypes = {
  events: Event
  events_users: EventUser
  location: Location
  notifications: Notification
  notifications_users: UserNotification
  page: Page
  promos: Promo
  page_content: PageContent
  site: Site
  user_account: UserAccount
  user_session: UserSession
  user_verification_token: UserVerificationToken
  user_email_events: UserEmailEvent
  user_relationships: UserRelationship
  users: User
  users_files: UserFile
  users_photos: UserPhoto
  directus_collections: DirectusCollection
  directus_fields: DirectusField
  directus_files: DirectusFile
  directus_folders: DirectusFolder
  directus_users: DirectusUser
}
