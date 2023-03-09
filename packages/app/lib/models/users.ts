import { UserInvite } from 'lib/models'
import {
  DirectusFile,
  User,
  UserAccount,
  Notification,
  UserPhoto,
  EventUser,
  Rating,
} from './directus'

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

export type SignUpForm = {
  first_name: string
  last_name: string
  birth_month: number
  birth_year: number
  email: string
  promo: string
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

export const MemberLevelColorMap = [
  ['red.500', 'red.100'],
  ['orange.500', 'orange.100'],
  ['yellow.500', 'yellow.100'],
  ['primary.100', 'primary.300'],
  ['primary.200', 'primary.400'],
  ['primary.300', 'primary.500'],
  ['primary.400', 'primary.600'],
  ['primary.500', 'primary.700'],
  ['primary.600', 'primary.800'],
  ['primary.700', 'primary.900'],
]

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

export type AppNotification = Omit<
  Notification,
  'id' | 'status' | 'users' | 'data' | 'template'
> & {
  id: number
  status: NotificationStatusType
}

export type UserStatusType = 'new' | 'active' | 'inactive' | 'stale' | 'deleted' | 'banned'

export type UserPhotoFieldType = 'photo' | 'picture' | 'public' | 'private'

export type UserFields = (string | keyof User)[] | '*' | '*.*' | any

export type Profile = {
  id: string
  picture?: DirectusFile | string
  nickname: string
  first_name: string
  last_name: string
  email: string
  email_verified: boolean
  phone: string
  phone_verified: boolean
  last_login: string | null
  session_expire: string | null
  in_sendgrid: boolean
  user_type: UserType
  application_status: string
  status: UserStatusType
  accounts: UserAccount[]
  auth_with_phone: boolean
}
export const profileFields: Array<keyof Profile> = [
  'id',
  'picture',
  'nickname',
  'first_name',
  'last_name',
  'email',
  'email_verified',
  'phone',
  'phone_verified',
  'last_login',
  'user_type',
  'application_status',
  'status',
  'auth_with_phone',
]

export type ContactPreferenceType = 'email' | 'phone_text' | 'phone_call'

export type Applicant = Profile & {
  invite?: UserInvite
  show_contact: boolean

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
  photo?: string | DirectusFile
  photo_denial_reason: string | null

  date_created: string
  date_updated: string
}
export const applicantFields: Array<keyof Applicant> = [
  ...profileFields,
  'vouched_by',
  'show_contact',

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
  'session_expire',
]

export type Member = Applicant & {
  notifications: AppNotification[]
  signed_waiver: boolean
  presence: 'offline' | 'online' | 'away'
  ratings: Rating[]

  video_consent: boolean
  photo_consent: boolean

  //-photos
  show_photos: boolean
  my_photos: UserPhoto[]

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
  events: EventUser[]

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
  private_folder?: string
  public_folder?: string
}

export type SearchableMember = Omit<
  User,
  | 'invite'
  | 'promo'
  | 'accounts'
  | 'in_sendgrid'
  | 'application_status'
  | 'contact_attempts'
  | 'accounts'
  | 'sessions'
  | 'notes'
  | 'tags'
  | 'flags'
  | 'reviewed_by'
  | 'photo_denial_reason'
>

export const memberProfilePrivateFields: Array<keyof Member> = [
  'last_name',
  'birth_month',
  'birth_year',
  'video_consent',
  'photo_consent',
]

export const memberProfileContactFields: Array<keyof Member> = [
  'email',
  'phone',
  'contact_preference',
]

export const memberProfileLocationFields: Array<keyof Member> = ['location', 'city', 'state']

export const memberProfileFields: Array<keyof Member> = [
  'age',
  'height',
  'weight',
  'skin_tone',
  'facial_hair',
  'eye_color',
  'hair_color',
  'hair_style',
  'body_hair',
  'build',
  'body_attributes',
]

export const memberProfileExplicitFields: Array<keyof Member> = [
  'ball_size',
  'ball_gravity',
  'cock_length',
  'cock_girth',
  'cock_attributes',
  'cum_attributes',
  'my_positions',
  'my_roles',
  'sexual_scenes',
]

export const memberInterestsFields: Array<keyof Member> = [
  'their_positions',
  'their_roles',
  'their_spectrum',
  'their_relationship_status',
]

export const memberEventFields: Array<keyof Member> = [
  'event_invites',
  'can_host',
  'event_availability',
  'social_scenes',
  'can_host_events',
]

export const memberHealthFields: Array<keyof Member> = [
  'hiv_status',
  'last_tested',
  'load_policy',
  'vaccinations',
]

export const searchableMemberFields: Array<keyof Member> = [
  'user_type',
  'presence',
  'rating',
  'nickname',
  'biography',
  'relationship_status',
  'spectrum',
  'mannerisms',
  'private_folder',
  'public_folder',
  ...memberProfilePrivateFields,
  'show_contact',
  ...memberProfileContactFields,
  'show_profile',
  ...memberProfileFields,
  'show_explicit',
  ...memberProfileExplicitFields,
  'show_health',
  ...memberHealthFields,
  'show_interests',
  ...memberInterestsFields,
  'show_events',
  ...memberEventFields,
  'show_location',
  ...memberProfileLocationFields,
  'show_photos',
  'my_photos',
]

export const memberFields: Array<keyof Member> = [...applicantFields, ...searchableMemberFields]

export const getAllowedUsers = (level: MemberLevel) => {
  let allowedLevels: UserType[] = ['brother', 'big_brother', 'staff', 'admin']
  if (level >= MemberLevel.brother) allowedLevels = [...allowedLevels, 'inductee']
  if (level >= MemberLevel.big_brother) allowedLevels = [...allowedLevels, 'pledge']
  if (level >= MemberLevel.staff) allowedLevels = [...allowedLevels, 'applicant', 'subscriber']

  return allowedLevels
}
