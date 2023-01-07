import { User, UserAccount, Notification, UserNotification } from './directus'

type Color = {
  DEFAULT: string
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}
export type Brand = {
  colors: {
    gray: Color
    primary: Color
    secondary: Color
    accents: Color
  }
  logo: string
}
export type SubscriptionData = {
  name?: string
  email?: string
}

export type AgreementData = {
  agree: boolean
}

export type InviteLink = {
  email: string
  link: string
}

export type NotificationStatus = 'new' | 'sent' | 'read' | 'deleted'

export enum MemberLevel {
  reject = 0,
  subscriber = 1,
  user = 2,
  pledge = 3,
  member = 4,
  brother = 5,
  big_brother = 6,
  // -- //
  staff = 10,
}

export enum ApplicationStatus {
  apply = 0,
  verify = 1,
  review = 2,
  agreement = 3,
  approved = 4,
  denied = -1,
}

export type AppNotification = {
  id: number
  status: NotificationStatus
  link?: string
  subject?: string
  message?: string
  body?: string
  date_sent?: string
  date_created?: string
}

export type UserStatusType = 'new' | 'active' | 'inactive' | 'stale' | 'deleted' | 'banned'

export type UserType =
  | 'reject'
  | 'subscriber'
  | 'user'
  | 'pledge'
  | 'member'
  | 'brother'
  | 'big_brother'
  | 'staff'

export type Profile = {
  id: string
  picture: string
  nickname: string
  first_name: string
  last_name: string
  email: string
  email_verified: boolean
  last_login: string | null
  in_sendgrid: boolean
  user_type: UserType
  application_status: string
  status: UserStatusType
  accounts: UserAccount[]
}
export const profileFields: Array<keyof User> = [
  'id',
  'picture',
  'nickname',
  'first_name',
  'last_name',
  'email',
  'email_verified',
  'last_login',
  'user_type',
  'application_status',
  'status',
]

export type ContactPreferenceType = 'email' | 'phone_text' | 'phone_call'

export type Applicant = Profile & {
  invite?: string
  phone: string
  phone_verified: boolean
  contact_preference: ContactPreferenceType
  vouched_by: string
  biography: string
  needs_guidance: boolean
  spectrum: string
  relationship_status: string
  event_availability: User['event_availability']
  age: number
  height: string
  weight: number
  skin_tone: User['skin_tone']
  my_positions: User['my_positions']
  sexual_scenes: User['sexual_scenes']
  social_scenes: User['social_scenes']
  photo: string | null
  photo_denial_reason: string | null
}
export const applicantFields: Array<keyof User> = [
  ...profileFields,
  'vouched_by',
  'phone',
  'phone_verified',
  'contact_preference',
  'biography',
  'needs_guidance',
  'spectrum',
  'relationship_status',
  'event_availability',
  'age',
  'height',
  'weight',
  'skin_tone',
  'my_positions',
  'sexual_scenes',
  'social_scenes',
  'photo',
  'photo_denial_reason',
]

export type Member = Applicant & {
  nickname: User['nickname']
  video_consent: boolean
  photo_consent: boolean
  notifications: AppNotification[]
  location?: string
  can_host?: boolean
  //-profile
  body_hair?: string
  facial_hair?: string
  hair_color?: string
  hair_style?: string
  body_attributes?: unknown
  eye_color?: string
  mannerisms?: string
  //-new
  cock_length?: number
  cock_girth?: string
  cock_attributes?: unknown
  ball_size?: string
  ball_gravity?: string
  cum_attributes?: unknown
  load_policy?: unknown

  //-health
  hiv_status?: string
  last_tested?: string
  vaccinations?: unknown
  //-them
  their_positions?: unknown
  their_roles?: unknown
  their_spectrum?: unknown
}
export const memberFields: Array<keyof User> = [
  ...applicantFields,
  'nickname',
  'video_consent',
  'photo_consent',
  'notifications',
  'body_hair',
  'facial_hair',
  'hair_color',
  'hair_style',
  'body_attributes',
  'eye_color',
  'ball_size',
  'ball_gravity',
  'cum_attributes',
  'load_policy',
  'hiv_status',
  'last_tested',
  'vaccinations',
  'mannerisms',
  'cock_length',
  'cock_girth',
  'cock_attributes',
  'their_positions',
  'their_roles',
  'their_spectrum',
]
