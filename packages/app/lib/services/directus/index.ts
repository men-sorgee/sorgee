import { Page, PageContent, User } from './types';

export type SectionContainerType =
  | 'grid-cols-1'
  | 'grid-cols-2'
  | 'grid-cols-3'
  | 'grid-cols-4';

export type ContentType = 'html' | 'md' | 'image' | 'control';

export type ContentSection = PageContent & {
  hash: string;
  image: {
    id: string;
    height: number;
    width: number;
    title: string;
    description: string;
  };
};

export const applicantFields: Array<keyof User> = [
  'id',
  'nickname',
  'first_name',
  'last_name',
  'email',
  'email_verified',
  'photo',
  'phone',
  'phone_verified',
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
  'application_status',
  'user_type',
  'vouched_by',
  'last_login',
  'status'
];

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

export type ApplicationStatusType =
  | 'apply'
  | 'verify'
  | 'review'
  | 'agreement'
  | 'approved'
  | 'denied';
export function getApplicationStatusIndex(status: ApplicationStatusType) {
  const steps: Array<ApplicationStatusType> = [
    'apply',
    'verify',
    'review',
    'agreement',
    'approved'
  ];
  return steps.indexOf(status);
}

export type SectionPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  markdown: string;
  status: 'published' | 'draft';
  in_menu: boolean;
  image?: {
    id: string;
    height: number;
    width: number;
    description: string;
    title: string;
  };
  content: ContentSection[];
};

export type Applicant = {
  nickname: User['nickname'];
  id: User['id'];
  first_name: User['first_name'];
  last_name: User['last_name'];
  email: User['email'];
  vouched_by: string;
  email_verified: User['email_verified'];
  phone: User['phone'];
  biography: User['biography'];
  needs_guidance: User['needs_guidance'];
  spectrum: User['spectrum'];
  relationship_status: User['relationship_status'];
  event_availability: User['event_availability'];
  age: User['age'];
  height: User['height'];
  weight: User['weight'];
  skin_tone: User['skin_tone'];
  my_positions: User['my_positions'];
  user_type: UserType;
  invite?: string;
  picture?: string | null;
  status: StatusType;
  application_status: ApplicationStatusType;
  last_login: User['last_login'];
  photo: string | null;
};

export type CMSPageProps = {
  title: string;
  description: string;
  content: ContentSection[];
};

export type MenuPage = {
  title: string;
  path: string;
};

export const memberFields: Array<keyof User> = [
  'nickname',
  ...applicantFields,
  'sexual_scenes'
];

export type Member = Applicant & {
  nickname: User['nickname'];
  sexual_scenes: User['sexual_scenes'];
};

export type UserInvite = {
  e: User['email'];
  t: User['user_type'];
  v: User['id'];
};
