import {
  Coordinates,
  DirectusFile,
  DirectusUser,
  EventUser,
  MembershipNames,
  NotificationUser,
  PageProps,
  Promo,
  QueryFields,
  Rating,
  UserInvite
} from "lib/models";
import { ProviderType } from "next-auth/providers";

export type MemberSearchQueryParams = PageProps<Partial<Omit<SearchableMember, 'id'>>> & {
  online?: boolean
  photos?: boolean
}

export type MemberStats = {
  subscribers: number
  applicants: number
  pledges: number
  inductees: number
  brothers: number
  big_brothers: number
  staff: number
}


export type UserEmailChange = Pick<User, 'email' | 'email_new'>

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
  user_id: string | UserIcon | Partial<User>
  buddy_id: string | UserIcon | Partial<User>
  sort: number
}

export type UserLike = {
  id: string
  user_id: string | UserIcon | Partial<User>
  like_id: string | UserIcon | Partial<User>
  sort: number
}

export type UserShare = {
  id: string
  user_id: string | UserIcon | Partial<User>
  viewer_id: string | UserIcon | Partial<User>
}

export type UserView = {
  id: string
  user_id: string | UserIcon | Partial<User>
  viewed_id: string | UserIcon | Partial<User>
  count: number
  date_created: string
  date_updated: string
}

export type UserViews = {
  count: number
  users: Array<{
    user: UserIcon | Partial<User>
    count: number
  }>
}

export type UserBlock = {
  id: string
  user_id: string | UserIcon | Partial<User>
  blocked_id: string | UserIcon | Partial<User>
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

export interface User {
  id: string
  invite?: UserInvite
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
  vouched_by?: string | UserIcon | Partial<User>
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
  application_status: ApplicationStatusType
  notifications: string[] | NotificationUser[]

  in_sendgrid?: boolean
  picture?: string | DirectusFile
  video_consent?: boolean
  photo_consent?: boolean
  photo_denial_reason?: string
  tags?: string[]
  location?: Coordinates
  state: string
  invites: EventUser[]
  my_photos: UserPhoto[]
  // email_events: string[] | UserEmailEvent[]
  images: UserFile[]
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
  contact_attempts: UserContactAttempt[]
  can_host?: boolean
  can_host_events: ('sex' | 'social' | 'individual')[]
  promo: number | Promo
  rating: number
  ratings: string[] | Rating[]
  allow_messages: AllowedMessageType
  photo_shares: UserShare[]
  private_folder?: string
  public_folder?: string

  buddies: UserBuddy[]
  buddy_of: UserBuddy[]
  likes: UserLike[]
  liked_by: UserLike[]
  blocked: UserBlock[]
  blocked_by: UserBlock[]

  membership_type?: MembershipNames
  customer_id?: string
  subscription_id?: string
  membership_start?: string
  membership_end?: string
  renewal_type?: string
  has_features: Array<MemberFeature>
}

export type UserIcon = Pick<User, 'id' | 'nickname' | 'picture' | 'presence' | 'status'>

export const UserIconFields: QueryFields<User> = ['id', 'nickname', 'picture', 'presence', 'status']

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

export type MemberSearchResults<T = Member> = { data: T[], count: number }

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
  Directus_files_id: DirectusFile
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

export type UserFields = QueryFields<User>

export type Profile = Pick<User,
  'id' |
  'picture' |
  'nickname' |
  'first_name' |
  'last_name' |
  'email' |
  'email_new' |
  'email_token' |
  'email_verified' |
  'phone' |
  'phone_verified' |
  'last_login' |
  'session_expire' |
  'in_sendgrid' |
  'user_type' |
  'application_status' |
  'status' |
  'sessions' |
  'accounts' |
  'auth_with_phone' |
  'vouched_by'>

export const profileFields: QueryFields<Profile> = [
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
  'session_expire',
  'in_sendgrid',
  'user_type',
  'application_status',
  'status',
  'sessions',
  'accounts',
  'auth_with_phone',
  'vouched_by'
]

export type ContactPreferenceType = 'email' | 'phone_text' | 'phone_call'

export type Applicant = Profile & Pick<User,
  'invite' |
  'show_contact' |
  'notifications' |
  'contact_preference' |
  'biography' |
  'needs_guidance' |
  'spectrum' |
  'relationship_status' |
  'event_availability' |
  'birth_month' |
  'birth_year' |
  'age' |
  'height' |
  'weight' |
  'skin_tone' |
  'my_positions' |
  'my_roles' |
  'sexual_scenes' |
  'social_scenes' |
  'photo' |
  'photo_denial_reason' |
  'approved_date' |
  'date_created' |
  'date_updated' |
  'session_expire'>

export const applicantFields: QueryFields<Applicant> = [
  ...profileFields,
  'invite',
  'show_contact',
  'notifications',
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
  'approved_date',
  'date_created',
  'date_updated',
  'session_expire',
]

export type MemberFeature =
  'view_directory' |
  'chat' |
  'share_photos' |
  'buddy_list' |
  'flirt' |
  'view_attendees' |
  'my_views' |
  'private_events'

export const memberFeatures: MemberFeature[] = [
  'view_directory',
  'flirt',
  'buddy_list',
  'view_attendees',
  'chat',
  'share_photos',
  'my_views',
  'private_events'
]


export type PresenceType = 'offline' | 'online' | 'away'

export type ProgressType =
  'avatar' |
  'contact' |
  'events' |
  'interests' |
  'profile' |
  'explicit' |
  'roles' |
  'health' |
  'photos' |
  'location'

export type Member = Applicant & Pick<User,
  'vouched_by' |
  'signed_waiver' |
  'presence' |
  'ratings' |
  'progress' |

  'video_consent' |
  'photo_consent' |

  //-photos
  'show_photos' |
  'my_photos' |

  //-location
  'show_location' |
  'location' |
  'city' |
  'state' |

  //-events
  'show_events' |
  'can_host' |
  'can_host_events' |
  'event_invites' |
  'invites' |

  //-profile
  'show_profile' |
  'nickname' |
  'body_hair' |
  'facial_hair' |
  'hair_color' |
  'hair_style' |
  'body_attributes' |
  'eye_color' |
  'mannerisms' |
  'build' |

  //-explicit
  'show_explicit' |
  'cock_length' |
  'cock_girth' |
  'cock_attributes' |
  'ball_size' |
  'ball_gravity' |
  'cum_attributes' |

  //-explicit roles
  'show_explicit_roles' |
  'my_positions' |
  'my_roles' |
  'sexual_scenes' |

  //-health
  'show_health' |
  'hiv_status' |
  'last_tested' |
  'vaccinations' |
  'load_policy' |

  //-them
  'show_interests' |
  'their_positions' |
  'their_roles' |
  'their_spectrum' |
  'their_relationship_status' |

  'allow_messages' |

  'buddies' |
  'buddy_of' |

  'photo_shares' |

  'likes' |
  'liked_by' |

  'blocked' |
  'blocked_by' |

  'rating' |
  'private_folder' |
  'public_folder' |

  'membership_type' |
  'subscription_id' |
  'customer_id' |
  'membership_start' |
  'membership_end' |
  'renewal_type' |
  'has_features'>


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
  | 'show_profile'
>

export const userPrivateFields: QueryFields<User> = [
  'promo',
  'accounts',
  'in_sendgrid',
  'application_status',
  'approved_date',
  'contact_attempts',
  'sessions',
  'notes',
  'tags',
  'flags',
  'reviewed_by',
  'photo_denial_reason',
]

export const memberProfilePrivateFields: QueryFields<Member> = [
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

export const memberProfileContactFields: QueryFields<Member> = [
  'email',
  'phone',
  'contact_preference',
]

export const memberProfileLocationFields: QueryFields<Member> = ['location', 'city', 'state']

export const memberProfileFields: QueryFields<Member> = [
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

export const memberProfileExplicitFields: QueryFields<Member> = [
  'ball_size',
  'ball_gravity',
  'cock_length',
  'cock_girth',
  'cock_attributes',
  'cum_attributes',
]

export const memberProfileExplicitRolesFields: QueryFields<Member> = [
  'my_positions',
  'my_roles',
  'sexual_scenes',
]

export const memberInterestsFields: QueryFields<Member> = [
  'their_positions',
  'their_roles',
  'their_spectrum',
  'their_relationship_status',
]

export const memberEventFields: QueryFields<Member> = [

  'event_availability',
  'social_scenes'
]

export const memberProfileHealthFields: QueryFields<Member> = [
  'hiv_status',
  'last_tested',
  'load_policy',
  'vaccinations',
]

export const memberProfilePhotoFields: QueryFields<Member> = [
  'my_photos.*' as any,

]

export const searchableMemberFields: QueryFields<Member> = [
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
  { vouched_by: UserIconFields },
  {
    buddies: [
      { buddy_id: UserIconFields }
    ]
  },
  {
    buddy_of: [
      { user_id: UserIconFields }
    ]
  },
  {
    likes: [
      { like_id: UserIconFields },
    ]
  },
  {
    liked_by: [
      { user_id: UserIconFields },
    ]
  },
  {
    blocked: [
      { blocked_id: UserIconFields },
    ]
  },
  {
    blocked_by: [
      { user_id: UserIconFields },
    ]
  },
  {
    photo_shares: [
      { viewer_id: UserIconFields },
    ]
  },
  { invites: ['*', { events_id: ['id', 'name', 'status', "datetime", "type"] }] },
  'show_contact',
  'approved_date',
  'membership_type',
  'show_profile',
  'has_features'
]

export const memberSubscriptionFields: QueryFields<Member> = [
  'membership_type',
  'customer_id',
  'subscription_id',
  'membership_start',
  'membership_end',
  'renewal_type',
  'has_features'
]

export const memberFields: QueryFields<Member> = [
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
  {
    invites:
      ['*',
        { users_id: ['id', 'picture', 'nickname', 'presence'] }
      ]
  },
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
