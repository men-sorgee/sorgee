import { Survey, Rating } from './surveys'
import { Member, MemberLevel, SearchableMember, User, UserType } from './users'

export type UserInvite = {
  e: string
  t: MemberLevel
  v: string
}

export enum InviteRSVPType {
  Invited = 'invited',
  Maybe = 'maybe',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Declined = 'declined',
}

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
  name: string
  location?: string | Location
  description: string
  cost: number
  type: string
  invite_only: boolean
  visibility: UserType[]
}

export type GroupEvent = {
  id: string
  status: string | EventStatusType
  datetime?: string
  name?: string
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
  users_id: string | User
  engagement?: unknown
  attended?: boolean
  flags?: unknown
  rsvp?: string
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
  rsvp: string
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
}
