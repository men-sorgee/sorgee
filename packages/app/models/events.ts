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

export type Event = {
  id: string;
  name: string;
  description: string;
  datetime: string | Date;
};

export type Invite = EventInvite & {
  id: string;
  name: string;
  description: string;
  datetime: string | Moment;
};

export type EventInvite = {
  events_id: string;
  users_id: string;
  rsvp: EventInviteRSVPType | string;
  reason: string;
};
