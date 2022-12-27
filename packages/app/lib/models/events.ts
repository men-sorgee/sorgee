import { Moment } from 'moment';
import { EventUser } from 'directus';
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

export type Invite = EventUser & {
  id: string;
  name: string;
  description: string;
  datetime: string | Moment;
  status: EventStatusType;
};

export type EventInvite = EventUser & {
  rsvp: EventInviteRSVPType;
};
