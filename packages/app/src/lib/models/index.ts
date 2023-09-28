

import {
  BillingEvent,
  EventUser,
  GroupEvent,
  MemberAlert,
  Message,
  NotificationUser,
  Page,
  PageContent,
  Promo,
  Question,
  Rating,
  Site,
  Survey,
  SurveyAnswer,
  SurveyQuestion,
  User,
  UserAccount,
  UserBlock,
  UserBuddy,
  UserEmailEvent,
  UserFile,
  UserLike,
  UserPayment,
  UserPhoto,
  UserSession,
  UserShare,
  UserVerificationToken,
  UserView
} from "lib/models";

import {
  DirectusField as DField,
  DirectusFile as DFile,
  DirectusFolder as DFolder,
  DirectusUser as DUser,
  QueryFields as QFields
} from "@directus/sdk";

export interface GNHSchema {
  events: GroupEvent[]
  events_users: EventUser[]
  location: Location[]
  notifications: Notification[]
  notifications_users: NotificationUser[]
  user_notification: MemberAlert[]
  page: Page[]
  promos: Promo[]
  page_content: PageContent[]
  site: Site[]
  surveys: Survey[]
  survey_questions: Question[]
  survey_survey_questions: SurveyQuestion[]
  survey_answers: SurveyAnswer[]
  user_account: UserAccount[]
  user_session: UserSession[]
  billing_event: BillingEvent[]
  user_payment: UserPayment[]
  user_verification_token: UserVerificationToken[]
  user_email_events: UserEmailEvent[]
  user_buddy: UserBuddy[]
  user_like: UserLike[]
  user_shares: UserShare[]
  user_views: UserView[]
  users: User[]
  users_files: UserFile[]
  users_photos: UserPhoto[]
  user_block: UserBlock[]
  rating: Rating[]
  messages: Message[]
}

export type PageProps<T> = Record<keyof T, string | string[]> & {
  page: number
  size: number
  sort: string
}

export type DirectusField = DField<GNHSchema> & { options: Array<{ text: string, value: string }> }
export type DirectusFile = DFile<GNHSchema>
export type DirectusUser = DUser<GNHSchema>
export type DirectusFolder = DFolder<GNHSchema>
export type QueryFields<T> = QFields<GNHSchema, T>

export * from './billing';
export * from './events';
export * from './files';
export * from './location';
export * from './messages';
export * from './notifications';
export * from './static';
export * from './surveys';
export * from './users';

