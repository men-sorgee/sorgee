import { EventUser, Event } from './directus'
import { MemberLevel } from './users'

export type UserInvite = {
  e: string
  t: MemberLevel
  v: string
}

export type EventDetail = Event & {
  invited_count: number
  confirmed_count: number
  maybe_count: number
  attended_count: number
  paid_count: number
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
  id: string
  name: string
  description: string
  datetime: string
  status: EventStatusType
}

export type EventInvite = EventUser & {
  rsvp: InviteRSVPType
}
