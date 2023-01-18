import { User, UserAccount } from './directus'

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
export const profileFields: Array<keyof Profile> = [
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
  birth_month: number
  birth_year: number
  height: string
  weight: number
  skin_tone: User['skin_tone']
  my_positions: User['my_positions']
  my_roles: User['my_roles']
  sexual_scenes: User['sexual_scenes']
  social_scenes: User['social_scenes']
  photo: string | null
  photo_denial_reason: string | null
}
export const applicantFields: Array<keyof Applicant> = [
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
  'birth_month',
  'birth_year',
  'height',
  'weight',
  'skin_tone',
  'my_positions',
  'my_roles',
  'sexual_scenes',
  'social_scenes',
  'photo',
  'photo_denial_reason',
]

export type Member = Applicant & {
  presence: 'offline' | 'online' | 'away'
  nickname: User['nickname']
  video_consent: boolean
  photo_consent: boolean
  notifications: AppNotification[]
  signed_waiver: boolean
  location?: string
  city?: string
  state?: string
  // preferences
  can_host?: boolean
  can_host_events: string[]
  show_location?: boolean
  show_profile?: boolean
  show_interests?: boolean
  show_health?: boolean
  event_invites?: boolean
  //-profile
  body_hair?: string
  facial_hair?: string
  hair_color?: string
  hair_style?: string
  body_attributes?: string[]
  eye_color?: string
  mannerisms?: string
  //-new
  cock_length?: number
  cock_girth?: string
  cock_attributes?: string[]
  ball_size?: string
  ball_gravity?: string
  cum_attributes?: string[]
  load_policy?: string[]

  //-health
  hiv_status?: string
  last_tested?: string
  vaccinations?: string[]
  //-them
  their_positions?: string[]
  their_roles?: string[]
  their_spectrum?: OrientationType[]
  their_relationship_status?: string[]
}
export const memberFields: Array<keyof Member> = [
  ...applicantFields,
  'nickname',
  'city',
  'state',
  'video_consent',
  'photo_consent',
  'signed_waiver',
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
  'their_relationship_status',
  'can_host',
  'can_host_events',
  //'show_location',
  'show_profile',
  'show_interests',
  'show_health',
  'event_invites',
]
