import {
  EventDetail,
  EventStatusType,
  EventUser,
  GroupEvent,
  InviteRSVPType,
  Location,
  searchableMemberFields,
  Survey
} from "lib/models";

import { readItems } from "@directus/sdk";

import { getAdminClient } from "./";

function count<T>(ary: T[], classifier: (i: T) => any) {
  classifier = classifier || String
  return ary.reduce(function (counter, item) {
    var p = classifier(item)
    counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1
    return counter
  }, {})
}


export async function listAdminEvents(): Promise<GroupEvent[]> {
  const admin = await getAdminClient()
  const filter = {
    status: { _in: ['scheduled', 'occurred', 'planned'] },
  }
  const data = await client.request(readItems('events', {
    filter,
    fields: ['*',
      { location: ['*'] },
      {
        users: ['*', {
          users_id: ['*']
        }]
      },
      { survey: ['*'] }],
    sort: ['datetime'],
    deep: {
      users: {
        _limit: -1,
      }
    }
  }))
  if (!data || data.length == 0) return []
  return data as unknown as GroupEvent[]
}

export async function registerForEvent(
  event_id: string,
  user_id: string,
  rsvp: InviteRSVPType,
  paid_at: string = undefined
): Promise<EventUser> {
  const admin = await getAdminClient()
  const invite = await client.items('events_users').createItem({
    events_id: event_id,
    users_id: user_id,
    rsvp,
    paid_at
  })
  return invite as unknown as EventUser
}


export async function getEvent(id: string, filter?: any): Promise<GroupEvent> {
  const admin = await getAdminClient()
  const event: GroupEvent = (await client.items('events').readItem(id, {
    fields: [
      '*',
      'location.*',
      'users.*',
      ...searchableMemberFields.map((f) => `users.users_id.${f}`),
      'survey.*',
    ] as any,
    deep: {
      users: {
        _limit: -1,
      },
    },
    filter: filter || {},
  })) as any as GroupEvent
  if (!event) return null
  return event as GroupEvent
}

export async function updateEvent(id: string, data: Partial<GroupEvent>): Promise<GroupEvent> {
  const admin = await getAdminClient()
  const event = await client.items('events').updateItem(id, data)
  return event as unknown as GroupEvent
}

export async function updateEventUsers(ids: number[], data: Partial<EventUser>): Promise<EventUser[]> {
  const admin = await getAdminClient()
  const attendees = await client.items('events_users').updateMany(ids, data)
  return attendees as unknown as EventUser[]
}

export async function getEventDetail(id: string): Promise<EventDetail> {
  const admin = await getAdminClient()
  const event = await client.items('events').readItem(id, {
    fields: [
      '*',
      'location.*',
      'users.*',
      'users.users_id.email',
      ...searchableMemberFields.map((f) => `users.users_id.${f}`),
      'survey.*',
    ] as any,
    deep: {
      users: {
        _limit: -1,
      },
    },
  })
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
    users: eventUsers,
    invite_only,
    location: l,
    online_payments,
    survey,
  } = event

  const location = l as unknown as Location
  const attendance = (eventUsers as EventUser[]) || []

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
