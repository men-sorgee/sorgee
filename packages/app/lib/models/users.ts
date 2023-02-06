import { RatingRated, UserInvite } from 'lib/models'
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

export type NotificationStatusType = 'new' | 'sent' | 'read' | 'deleted'

export type UserType =
  | 'reject'
  | 'subscriber'
  | 'applicant'
  | 'pledge'
  | 'inductee'
  | 'brother'
  | 'big_brother'
  | 'staff'
  | 'admin'

export enum MemberLevel {
  reject = 0,
  subscriber = 1,
  applicant = 2,
  pledge = 3,
  inductee = 4,
  brother = 5,
  big_brother = 6,
  // -- //
  staff = 7,
  admin = 8,
}

export type ApplicationStatusType =
  | 'apply'
  | 'verify'
  | 'review'
  | 'agreement'
  | 'approved'
  | 'denied'

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
  status: string | NotificationStatusType
  link?: string
  subject?: string
  message?: string
  body?: string
  date_sent?: string
  date_created?: string
}

export type UserStatusType = 'new' | 'active' | 'inactive' | 'stale' | 'deleted' | 'banned'

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
  invite?: UserInvite
  show_contact: boolean
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
  age: number
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
  'show_contact',
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
  'age',
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
  notifications: AppNotification[]
  signed_waiver: boolean
  presence: 'offline' | 'online' | 'away'

  video_consent: boolean
  photo_consent: boolean

  //-location
  show_location?: boolean
  location?: string
  city?: string
  state?: string

  //-events
  show_events: boolean
  can_host?: boolean
  can_host_events: string[]
  event_invites?: boolean

  //-profile
  show_profile?: boolean
  nickname: User['nickname']
  body_hair?: string
  facial_hair?: string
  hair_color?: string
  hair_style?: string
  body_attributes?: string[]
  eye_color?: string
  mannerisms?: string
  build?: string

  //-explicit
  show_explicit: boolean
  cock_length?: number
  cock_girth?: string
  cock_attributes?: string[]
  ball_size?: string
  ball_gravity?: string
  cum_attributes?: string[]

  //-health
  show_health?: boolean
  hiv_status?: string
  last_tested?: string
  vaccinations?: string[]
  load_policy?: string[]

  //-them
  show_interests?: boolean
  their_positions?: string[]
  their_roles?: string[]
  their_spectrum?: OrientationType[]
  their_relationship_status?: string[]

  rating: number
}

export type SearchableMember = Omit<
  Member,
  | 'invite'
  | 'promo'
  | 'accounts'
  | 'in_sendgrid'
  | 'application_status'
  | 'signed_waiver'
  | 'phone_verified'
  | 'email_verified'
  | 'ratings'
  | 'notifications'
  | 'photos'
  | 'picture'
  | 'ratings'
  | 'ratings'
>

export const memberProfilePrivateFields: Array<keyof SearchableMember> = [
  'last_name',
  'birth_month',
  'birth_year',
]

export const memberProfileContactFields: Array<keyof SearchableMember> = [
  'show_contact',
  'email',
  'phone',
  'contact_preference',
  'video_consent',
  'photo_consent',
]

export const memberProfileLocationFields: Array<keyof SearchableMember> = [
  'show_location',
  'location',
  'city',
  'state',
]

export const memberProfileFields: Array<keyof SearchableMember> = [
  'show_profile',
  'nickname',
  'biography',
  'relationship_status',
  'age',
  'height',
  'weight',
  'skin_tone',
  'body_hair',
  'facial_hair',
  'hair_color',
  'hair_style',
  'body_attributes',
  'build',
  'eye_color',
]

export const memberProfileExplicitFields: Array<keyof SearchableMember> = [
  'show_explicit',
  'spectrum',
  'my_positions',
  'my_roles',
  'ball_size',
  'ball_gravity',
  'cum_attributes',
  'mannerisms',
  'cock_length',
  'cock_girth',
  'cock_attributes',
  'sexual_scenes',
]

export const memberInterestFields: Array<keyof SearchableMember> = [
  'show_interests',
  'their_positions',
  'their_roles',
  'their_spectrum',
  'their_relationship_status',
]

export const memberEventFields: Array<keyof SearchableMember> = [
  'show_events',
  'event_invites',
  'event_availability',
  'social_scenes',
  'can_host',
  'can_host_events',
]

export const memberHealthFields: Array<keyof SearchableMember> = [
  'show_health',
  'load_policy',
  'hiv_status',
  'last_tested',
  'vaccinations',
]

export const searchableMemberFields: Array<keyof SearchableMember> = [
  'user_type',
  'presence',
  'rating',
  ...memberProfilePrivateFields,
  ...memberProfileFields,
  ...memberProfileContactFields,
  ...memberProfileExplicitFields,
  ...memberHealthFields,
  ...memberInterestFields,
  ...memberEventFields,
  ...memberProfileLocationFields,
]

export const memberFields: Array<keyof Member> = [
  ...applicantFields,
  ...searchableMemberFields,
  'video_consent',
  'photo_consent',
  'signed_waiver',
  'rating',
]
