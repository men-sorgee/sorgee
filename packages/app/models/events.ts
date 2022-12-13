import { Moment } from 'moment';
import { MemberLevel } from './users';

export type UserInvite = {
  e: string;
  t: string | MemberLevel;
  v: string;
};

export enum EventInviteRSVPType {
  Invited = 'invited',
  Maybe = 'maybe',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Declined = 'declined'
}

export enum EventStatusType {
  Planned = 'planned',
  Scheduled = 'scheduled',
  OnHold = 'onhold',
  Cancelled = 'cancelled',
  Occurred = 'occurred'
}

export type Event = {
  id: string;
  name: string;
  description: string;
  datetime: string | Date;
  status: string | EventStatusType;
};

export type Invite = EventInvite & {
  id: string;
  name: string;
  description: string;
  datetime: string | Moment;
  status: string | EventStatusType;
};

export type EventInvite = {
  events_id: string;
  users_id: string;
  rsvp: EventInviteRSVPType | string;
  reason: string;
  attended: boolean;
};
