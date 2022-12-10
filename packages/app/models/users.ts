import { User } from 'lib/services/directus/types';

export type StatusType =
  | 'new'
  | 'active'
  | 'inactive'
  | 'stale'
  | 'deleted'
  | 'banned';

export type UserType =
  | 'reject'
  | 'subscriber'
  | 'user'
  | 'pledge'
  | 'member'
  | 'brother'
  | 'big_brother'
  | 'staff';

export enum MemberLevel {
  reject = 0,
  subscriber = 1,
  user = 2,
  pledge = 3,
  member = 4,
  brother = 5,
  big_brother = 6,
  // -- //
  staff = 10
}

export enum ApplicationStatus {
  apply = 0,
  verify = 1,
  review = 2,
  agreement = 3,
  approved = 4,
  denied = -1
}

export type Notification = {
  id: string;
  type: 'event' | 'message';
  message: string;
  link: string;
};

export type Profile = {
  sub: string;
  sid: string;
  id: string;
  picture: string;
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  last_login: string | null;
  in_sendgrid: boolean;
  user_type: string | UserType;
  application_status: string | ApplicationStatus;
  status: string | StatusType;
};
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
  'status'
];

export type Applicant = Profile & {
  invite?: string;

  vouched_by: string;
  phone: string;
  biography: string;
  needs_guidance: boolean;
  spectrum: string;
  relationship_status: string;
  event_availability: User['event_availability'];
  age: number;
  height: string;
  weight: number;
  skin_tone: User['skin_tone'];
  my_positions: User['my_positions'];
  sexual_scenes: User['sexual_scenes'];
  social_scenes: User['social_scenes'];
  application_status: string | ApplicationStatus;
  photo: string | null;
  photo_denial_reason: string | null;
};
export const applicantFields: Array<keyof User> = [
  ...profileFields,
  'vouched_by',
  'phone',
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
  'application_status',
  'photo',
  'photo_denial_reason'
];

export type Member = Applicant & {
  nickname: User['nickname'];
  video_consent: boolean;
  photo_consent: boolean;
  notifications: Notification[];
};
export const memberFields: Array<keyof User> = [
  ...applicantFields,
  'nickname',
  'video_consent',
  'photo_consent',
  'notifications'
];
