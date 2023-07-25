import {
  DirectusFile,
  DirectusUser,
  EventUser,
  MembershipNames,
  MembershipRenewalType,
  NotificationUser,
  Promo,
  Rating,
  UserEmailEvent,
  UserInvite,
} from 'lib/models'
import { ProviderType } from 'next-auth/providers'

export type UserEmailChange = { email: string; email_new: string }

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
  user: string
}

export type UserVerificationToken = {
  id: string
  email: string
  token: string
  expires: string
}

export type UserBuddy = {
  id: string
  user_id: string
  buddy_id: string | {
    id: string
    presence: PresenceType
  } | User
  sort: number
}

export type UserLike = {
  id: string
  user_id: string
  like_id: string
  sort: number
}

export type UserShare = {
  id: string
  user_id: string
  viewer_id: string
}
export type UserBlock = {
  id: string
  user_id: string
  blocked_id: string
}

export type UserContactAttempt = {
  id: string
  user_created?: string | DirectusUser
  date_created?: string
  date_updated?: string
  contact_method?: string
  notes?: string
  user?: string
}

export type User = {
  id: string
  presence: PresenceType
  status: UserStatusType
  last_login?: string
  session_expire?: string
  date_created?: string
  date_updated?: string
  first_name: string
  last_name?: string
  user_type: UserType
  approved_date?: string
  phone?: string
  phone_verified?: boolean
  email: string
  email_new?: string
  email_token?: string
  email_verified?: boolean
  sessions: string[] | UserSession[]
  contact_preference: ContactPreferenceType
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
  auth_with_phone: boolean
  vouched_by?: string | VouchingUser
  progress: ProgressType[]
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
  reviewed_by?: string | DirectusUser
  application_status: string | ApplicationStatusType
  in_sendgrid?: boolean
  picture?: string | DirectusFile
  video_consent?: boolean
  photo_consent?: boolean
  photo_denial_reason?: string
  tags?: string[]
  location?: string
  state: string
  events: string[] | EventUser[]
  my_photos: string[] | UserPhoto[]
  email_events: string[] | UserEmailEvent[]
  images: string[] | UserFile[]
  accounts: string[] | UserAccount[]
  show_profile: boolean
  show_explicit: boolean
  show_explicit_roles: boolean
  show_location: boolean
  show_contact: boolean
  show_interests: boolean
  show_health: boolean
  show_events: boolean
  show_images: boolean
  show_photos: boolean
  event_invites: boolean
  contact_attempts: string[] | UserContactAttempt[]
  can_host?: boolean
  can_host_events: string[] | ('sex' | 'social' | 'individual')[]
  promo: number | Promo
  rating: number
  ratings: string[] | Rating[]
  allow_messages: AllowedMessageType
  photo_shares: string[] | UserShare[]
  private_folder?: string
  public_folder?: string

  buddies: string[] | UserBuddy[]
  buddy_of: string[] | UserBuddy[]
  likes: string[] | UserLike[]
  liked_by: string[] | UserLike[]
  blocked: string[] | UserBlock[]
  blocked_by: string[] | UserBlock[]

  membership_type?: MembershipNames
  customer_id?: string
  subscription_id?: string
  membership_start?: string
  renewal_type?: string
  has_features: Array<MemberFeature>
}

export type AllowedMessageType = 'anyone' | 'buddies' | 'staff' | 'none'

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



export type UserType =
  | 'reject'
  | 'subscriber'
  | 'applicant'
  | 'pledge'
  | 'inductee'
  | 'brother'
  | 'big_brother'
  | 'staff'

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
}

export type VouchingUser = {
  id: string
  nickname: string
  picture: string
}

export const MemberLevelColorMap = [
  ['red.500', 'red.100'],
  ['orange.500', 'orange.100'],
  ['primary.100', 'primary.200'],
  ['primary.200', 'primary.300'],
  ['primary.300', 'primary.400'],
  ['primary.400', 'primary.500'],
  ['primary.500', 'primary.600'],
  ['primary.600', 'primary.700'],
  ['primary.700', 'primary.800'],
  ['primary.800', 'primary.900'],
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

export type UserFile = {
  id: number
  users_id?: string | User
  directus_files_id: DirectusFile
}

export type UserPhoto = {
  id?: number
  users_id?: string | User
  directus_files_id: DirectusFile | string
  sort?: number
  is_public: boolean
  status?: 'new' | 'approved' | 'rejected'
}

export type UserStatusType = 'new' | 'active' | 'inactive' | 'stale' | 'delete' | 'banned'

export type UserPhotoFieldType = 'photo' | 'picture' | 'public' | 'private'

export type UserFields = (string | keyof User)[] | '*' | '*.*' | any

export type Profile = {
  id: string
  picture?: DirectusFile | string
  nickname: string
  first_name: string
  last_name: string
  email: string
  email_new?: string
  email_token?: string
  email_verified: boolean
  phone: string
  phone_verified: boolean
  last_login: string | null
  session_expire: string | null
  in_sendgrid: boolean
  user_type: UserType
  application_status: ApplicationStatusType
  status: UserStatusType
  sessions: string[] | UserSession[]
  accounts: string[] | UserAccount[]
  auth_with_phone: boolean
  vouched_by?: string | VouchingUser
}
export const profileFields: Array<keyof Profile> = [

]

export type ContactPreferenceType = 'email' | 'phone_text' | 'phone_call'

export type Applicant = Profile & {
  invite?: UserInvite
  show_contact: boolean
  notifications: string[] | NotificationUser[]
  contact_preference: ContactPreferenceType

  biography: string
  needs_guidance: boolean
  spectrum: string
  relationship_status: string
  event_availability: string[]
  birth_month: number
  birth_year: number
  age: number
  height: string
  weight: number
  skin_tone: string
  my_positions: string[]
  my_roles: string[]
  sexual_scenes: string[]
  social_scenes: string[]
  photo?: string | DirectusFile
  photo_denial_reason: string | null
  approved_date?: string
  date_created: string
  date_updated: string
}
export const applicantFields: Array<keyof Applicant> = [
  'id',
  'picture',
  'nickname',
  'first_name',
  'last_name',
  'email',
  'email_new',
  'email_token',
  'email_verified',
  'phone',
  'phone_verified',
  'last_login',
  'user_type',
  'application_status',
  'status',
  'auth_with_phone',

  'show_contact',
  'contact_preference',
  'biography',
  'needs_guidance',
  'spectrum',
  'relationship_status',
  'event_availability',
  'birth_month',
  'birth_year',
  'approved_date',
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

export type MemberFeature =
  | 'view_directory'
  | 'chat'
  | 'share_photos'
  | 'buddy_list'
  | 'flirt'
  | 'view_attendees'

export const memberFeatures: MemberFeature[] = [
  'view_directory',
  'flirt',
  'buddy_list',
  'view_attendees',
  'chat',
  'share_photos',
]

export type PresenceType = 'offline' | 'online' | 'away'

export type ProgressType = 'avatar' | 'contact' | 'events' | 'interests' | 'profile' | 'explicit' | 'roles' | 'health' | 'photos' | 'location'

export type Member = Applicant & {
  vouched_by: VouchingUser
  signed_waiver: boolean
  presence: PresenceType
  ratings: Rating[]
  progress: ProgressType[]

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
  show_profile: boolean
  nickname: string
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

  //-explicit roles
  show_explicit_roles: boolean
  my_positions?: string[]
  my_roles?: string[]
  sexual_scenes?: string[]

  //-health
  show_health: boolean
  hiv_status?: string
  last_tested?: string
  vaccinations?: string[]
  load_policy?: string[]

  //-them
  show_interests: boolean
  their_positions?: string[]
  their_roles?: string[]
  their_spectrum?: OrientationType[]
  their_relationship_status?: string[]

  allow_messages: AllowedMessageType

  buddies: Pick<UserBuddy, 'buddy_id'>[]
  buddy_of: Pick<UserBuddy, 'user_id'>[]

  photo_shares: Pick<UserShare, 'viewer_id'>[]

  likes: Pick<UserLike, 'like_id'>[]
  liked_by: Pick<UserLike, 'user_id'>[]

  blocked: Pick<UserBlock, 'blocked_id'>[]
  blocked_by: Pick<UserBlock, 'user_id'>[]

  rating: number
  private_folder?: string
  public_folder?: string

  membership_type?: MembershipNames
  subscription_id?: string
  customer_id?: string
  membership_start?: string
  renewal_type?: MembershipRenewalType
  has_features: Array<MemberFeature>
}



export type SearchableMember = Omit<
  Member,
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
  | 'first_name'
  | 'last_name'
  | 'birth_month'
  | 'birth_year'
  | 'video_consent'
  | 'photo_consent'
  | 'invite'
  | 'accounts'
  | 'in_sendgrid'
  | 'application_status'
  | 'accounts'
  | 'photo_denial_reason'
>

export const userPrivateFields: Array<keyof User> = [
  'promo',
  'accounts',
  'in_sendgrid',
  'application_status',
  'contact_attempts',
  'sessions',
  'notes',
  'tags',
  'flags',
  'reviewed_by',
  'photo_denial_reason',
]

export const memberProfilePrivateFields: Array<keyof Member> = [
  'first_name',
  'last_name',
  'birth_month',
  'birth_year',
  'video_consent',
  'photo_consent',
  'invite',
  'accounts',
  'in_sendgrid',
  'application_status',
  'accounts',
  'photo_denial_reason',
  'private_folder',
  'public_folder',
  'approved_date',
  'ratings',
  'progress',
  'event_invites'
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
]

export const memberProfileExplicitRolesFields: Array<keyof Member> = [
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

  'event_availability',
  'social_scenes'
]

export const memberProfileHealthFields: Array<keyof Member> = [
  'hiv_status',
  'last_tested',
  'load_policy',
  'vaccinations',
]

export const memberProfilePhotoFields: Array<keyof Member> = [
  'my_photos.*' as any,

]

export const searchableMemberFields: Array<keyof Member> = [
  'id',
  'status',
  'nickname',
  'biography',
  'first_name',
  'picture',
  'user_type',
  'presence',
  'location',
  'city',
  'state',
  'rating',
  'spectrum',
  'my_positions',
  'show_profile',
  'relationship_status',
  'mannerisms',
  'allow_messages',
  'last_login',
  'date_created',
  'vouched_by',
  'vouched_by.id' as any,
  'vouched_by.nickname' as any,
  'vouched_by.picture' as any,
  'show_contact',
  'buddies.buddy_id.id' as any,
  'buddies.buddy_id.presence' as any,
  'buddy_of.user_id' as any,
  'likes.like_id' as any,
  'liked_by.user_id' as any,
  'blocked.blocked_id' as any,
  'blocked_by.user_id' as any,
  'photo_shares.viewer_id' as any,
]

export const memberSubscriptionFields: Array<keyof Member> = [
  'membership_type',
  'customer_id',
  'subscription_id',
  'membership_start',
  'renewal_type',
]

export const memberFields: Array<keyof Member> = [
  ...applicantFields,
  ...searchableMemberFields,
  ...memberProfilePrivateFields,
  'show_contact',
  ...memberProfileContactFields,
  'show_profile',
  ...memberProfileFields,
  'show_explicit',
  ...memberProfileExplicitFields,
  'show_explicit_roles',
  ...memberProfileExplicitRolesFields,
  'show_health',
  ...memberProfileHealthFields,
  'show_interests',
  ...memberInterestsFields,
  'show_events',
  'events.*.*' as any,
  'can_host',
  'can_host_events',
  ...memberEventFields,
  'show_location',
  ...memberProfileLocationFields,
  'show_photos',
  ...memberProfilePhotoFields,
  ...memberSubscriptionFields,
  'has_features'
]

export const getAllowedUsers = (level: MemberLevel) => {
  let allowedLevels: UserType[] = ['brother', 'big_brother', 'staff']
  if (level >= MemberLevel.brother)
    return [...allowedLevels, 'inductee', 'pledge']
  return allowedLevels
}
