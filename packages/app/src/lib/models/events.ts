import { DirectusFile, Member, User, UserPayment, UserType } from "lib/models";

import { Rating, Survey } from "./surveys";

export type UserInvite = {
  e: string
  v: string
}


export type InviteRSVPType =
  | 'invited'
  | 'maybe'
  | 'confirmed'
  | 'cancelled'
  | 'declined'
  | 'not_invited'

export enum EventStatusType {
  Planned = 'planned',
  Scheduled = 'scheduled',
  OnHold = 'onhold',
  Cancelled = 'cancelled',
  Occurred = 'occurred',
}

export type Invite = EventUser & {
  id: number
  name: string
  description: string
  datetime: string
  status: EventStatusType
  type: string
  cost: number
}

export type EventInfo = {
  id: string
  status: EventStatusType
  datetime: string
  datetime_end: string
  start?: string
  end?: string
  name: string
  location?: Location
  description: string
  cost: number
  type: string
  invite_only: boolean
  online_payments: boolean
  visibility: UserType[]
}

export type GroupEvent = {
  id: string
  status: string | EventStatusType
  datetime: string
  datetime_end: string
  start?: string
  end?: string
  name: string
  location?: string | Location
  description?: string
  cost: number
  expenses?: number
  type: string
  invite_only: boolean
  online_payments: boolean
  visibility: UserType[]
  invites: string[] | EventUser[]
  survey?: string[] | Survey[]
  ratings: string[] | Rating[]
}

export type EventUser = {
  id?: number
  events_id: string | GroupEvent
  users_id: string | Member
  engagement?: unknown
  attended?: boolean
  flags?: unknown
  rsvp: InviteRSVPType
  paid?: boolean
  paid_at?: string
  confirmed_at?: string
  receipt?: string
  amount?: number
  guest?: boolean
  reason?: string
  attendance?: string
  payment?: string | UserPayment
}

export type EventInvite = Omit<EventUser, 'users_id' | 'events_id'> & {
  event: GroupEvent
  member: Member
}

export type EventStats = {
  invited_count: number
  confirmed_count: number
  maybe_count: number
  attended_count: number
  paid_count: number
  prepaid_count: number
  cash_count: number
}

export type EventDetail = EventInfo & {
  attendance: EventUser[]
  expenses?: number
  stats: EventStats
  //members: SearchableMember[]
  surveys: Survey[]
}

export type Location = {
  id: string
  name?: string
  capacity?: number
  street?: string
  unit?: string
  city?: string
  state?: string
  zip?: string
  owner?: string | User
  notes?: string
  amenities?: unknown
  survey?: string | Survey
  display_threshold: number
  logo?: string | DirectusFile
}
