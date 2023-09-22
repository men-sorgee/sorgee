import { User } from "next-auth";
import { Message } from "react-hook-form";

import { DirectusField } from "@directus/sdk";

import { BillingEvent, UserPayment } from "./billing";
import { EventUser, GroupEvent } from "./events";
import { MemberAlert, NotificationUser, UserEmailEvent } from "./notifications";
import { Page, PageContent, Promo, Site } from "./static";
import {
  Question,
  Rating,
  Survey,
  SurveyAnswer,
  SurveyQuestion
} from "./surveys";
import {
  UserAccount,
  UserBlock,
  UserBuddy,
  UserFile,
  UserLike,
  UserPhoto,
  UserSession,
  UserShare,
  UserVerificationToken,
  UserView
} from "./users";

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

export type FieldMap = Record<string, DirectusField<GNHSchema>>

export * from './billing';
export * from './events';
export * from './files';
export * from './location';
export * from './messages';
export * from './notifications';
export * from './static';
export * from './surveys';
export * from './users';

