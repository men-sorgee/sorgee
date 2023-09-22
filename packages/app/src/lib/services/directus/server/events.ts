import {
  EventDetail,
  EventStatusType,
  EventUser,
  GroupEvent,
  InviteRSVPType,
  Location,
  Member,
  Survey
} from "lib/models";

import {
  createItem,
  readItem,
  readItems,
  updateItem,
  updateItems
} from "@directus/sdk";

import { getAdminClient } from "./";

export async function listAdminEvents(): Promise<GroupEvent[]> {
  const admin = getAdminClient()
  const filter = {
    status: { _in: ['scheduled', 'occurred', 'planned'] },
  }
  const data = await admin.request<GroupEvent[]>(readItems('events', {
    filter,
    fields: ['*',
      { location: ['*'] },
      {
        invites: ['*', {
          users_id: ['*']
        }]
      },
      { survey: ['*'] }],
    sort: ['datetime'],
    deep: {
      invites: {
        _limit: -1,
      }
    }
  }))
  if (!data || data.length == 0) return []
  return data
}

export async function registerForEvent(
  event_id: string,
  user_id: string,
  rsvp: InviteRSVPType,
  paid_at: string = undefined
): Promise<EventUser> {
  const admin = getAdminClient()
  const invite = await admin.request<EventUser>(createItem('events_users', {
    events_id: event_id,
    users_id: user_id,
    rsvp,
    paid_at
  }))
  return invite
}

const userFields: Array<keyof Member> = [
  'nickname', 'picture', 'id', 'email',
  'show_profile', 'biography', 'user_type',
  'has_features', 'status', 'application_status',
  'date_created', 'last_login', 'location']

export async function getEvent(id: string, filter?: any): Promise<GroupEvent> {
  const admin = getAdminClient()
  const event = await admin.request<GroupEvent>(readItem('events', id, {
    fields: [
      '*',
      'location.*',
      'invites.*',
      ...userFields.map((f) => `invites.users_id.${f}`),
      'survey.*'
    ] as any,
    deep: {
      invites: {
        _limit: -1,
      },
      survey: {
        status: {
          _eq: 'published'
        }
      }
    },
    filter: filter || {},
  }))
  if (!event) return null
  return event as GroupEvent
}

export async function updateEvent(id: string, data: Partial<GroupEvent>): Promise<GroupEvent> {
  const admin = getAdminClient()
  return await admin.request<GroupEvent>(updateItem('events', id, data))
}

export async function updateEventUsers(ids: number[], data: Partial<EventUser>): Promise<EventUser[]> {
  const admin = getAdminClient()
  const attendees = await admin.request<EventUser[]>(updateItems('events_users', ids, data))
  return attendees
}

export async function getEventDetail(id: string): Promise<EventDetail> {
  const admin = getAdminClient()
  const event = await admin.request<GroupEvent>(readItem('events', id, {
    fields: [
      '*',
      'location.*',
      'invites.*',
      ...userFields.map((f) => `invites.users_id.${f}`),
      'survey.*'
    ] as any,
    deep: {
      invites: {
        _limit: -1,
      },
      survey: {
        status: {
          _eq: 'published'
        }
      }
    },
  }))
  const {
    name,
    description,
    datetime,
    datetime_end,
    start,
    end,
    status,
    type,
    visibility,
    cost,
    invites,
    invite_only,
    location: l,
    online_payments,
    survey,
  } = event

  const location = l as Location
  const attendance = invites as EventUser[]

  const detail: EventDetail = {
    id,
    name,
    description,
    datetime,
    datetime_end,
    start,
    end,
    status: status as EventStatusType,
    type,
    visibility,
    cost,
    attendance,
    invite_only,
    online_payments,
    location,
    expenses: event.expenses,
    stats: {
      invited_count: attendance.length,
      confirmed_count: attendance.filter((u) => u.rsvp === 'confirmed').length,
      maybe_count: attendance.filter((u) => u.rsvp === 'maybe').length,
      attended_count: attendance.filter((u) => u.attended).length,
      paid_count: attendance.filter((u) => u.paid).length,
      prepaid_count: attendance.filter((u) => u.payment).length,
      cash_count: attendance.filter((u) => u.paid).length - attendance.filter((u) => u.payment).length
    },
    //members: attendance.map((u) => u.users_id as any as SearchableMember),
    surveys: survey as Survey[]
  }
  return detail
}
