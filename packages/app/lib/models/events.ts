import { EventUser, GroupEvent } from './directus'
import { MemberLevel, SearchableMember } from './users'

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

export type EventInvite = EventUser & {
  rsvp: InviteRSVPType
}
