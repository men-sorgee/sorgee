import { DirectusFile } from "lib/models";

import { Rating, Survey } from "./surveys";
import { Member, SearchableMember, User, UserType } from "./users";

export type UserInvite = {
  e: string
  v: string
}

export type RSVPInfo = {
  user_id: string
  event_id: string
  invite_id?: number
  reason?: string
  rsvp?: InviteRSVPType
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
  name: string
  location?: Location
  description: string
  cost: number
  type: string
  invite_only: boolean
  visibility: UserType[]
}

export type GroupEvent = {
  id: string
  status: string | EventStatusType
  datetime: string
  datetime_end: string
  name: string
  location?: string | Location
  description?: string
  cost: number
  type: string
  invite_only: boolean
  visibility: UserType[]
  users: string | EventUser[]
  survey?: string[] | Survey[]
  ratings: string[] | Rating[]
}

export type EventUser = {
  id: number
  events_id: string | GroupEvent
  users_id: string | Member
  engagement?: unknown
  attended?: boolean
  flags?: unknown
  rsvp?: InviteRSVPType
  paid?: boolean
  guest?: boolean
  reason?: string
  attendance?: string
}

export type EventInvite = {
  id?: number
  event: GroupEvent
  member: Member
  attended: boolean
  rsvp: InviteRSVPType
  paid: boolean
  guest: boolean
  reason: string
  attendance?: string
}

export type EventStats = {
  invited_count: number
  confirmed_count: number
  maybe_count: number
  attended_count: number
  paid_count: number
}

export type EventDetail = EventInfo & {
  attendance: EventUser[]
  stats: EventStats
  members: SearchableMember[]
  surveys: Survey[]
}

export type Location = {
  id: string
  name?: string
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
