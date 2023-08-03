import {
  EventDetail,
  EventStatusType,
  EventUser,
  GroupEvent,
  InviteRSVPType,
  Location,
  SearchableMember,
  searchableMemberFields,
  Survey,
  UserType
} from "lib/models";

import { getAdminClient } from "./";

function count<T>(ary: T[], classifier: (i: T) => any) {
  classifier = classifier || String
  return ary.reduce(function (counter, item) {
    var p = classifier(item)
    counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1
    return counter
  }, {})
}

export async function listUpcomingEvents(user_type: UserType): Promise<GroupEvent[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events').readByQuery({
    filter: {
      status: { _in: ['scheduled', 'planned'] },
      datetime: { _gte: '$NOW(-7 days)' },
      invite_only: { _eq: false },
    },
    fields: ['*.*'],
    sort: ['datetime'],
  })
  if (user_type == 'staff') return data as unknown as GroupEvent[]
  return (data?.filter((e) => e.visibility?.includes(user_type)) || []) as unknown as GroupEvent[]
}

export async function listAdminEvents(): Promise<GroupEvent[]> {
  const client = await getAdminClient()
  const filter = {
    status: { _in: ['scheduled', 'occurred', 'planned'] },
  }
  const { data } = await client.items('events').readByQuery({
    filter,
    fields: ['*.*'],
    sort: ['datetime'],
    deep: {
      users: {
        _limit: -1,
      }
    }
  })
  if (!data || data.length == 0) return []
  return data as unknown as GroupEvent[]
}

export async function registerForEvent(
  event_id: string,
  user_id: string,
  rsvp: InviteRSVPType
): Promise<EventUser> {
  const client = await getAdminClient()
  const invite = await client.items('events_users').createOne({
    events_id: event_id,
    users_id: user_id,
    rsvp,
  })
  return invite as unknown as EventUser
}


export async function getEvent(id: string, filter?: any): Promise<GroupEvent> {
  const client = await getAdminClient()
  const event: GroupEvent = (await client.items('events').readOne(id, {
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
  const client = await getAdminClient()
  const event = await client.items('events').updateOne(id, data)
  return event as unknown as GroupEvent
}

export async function updateEventUsers(ids: number[], data: Partial<EventUser>): Promise<EventUser[]> {
  const client = await getAdminClient()
  const attendees = await client.items('events_users').updateMany(ids, data)
  return attendees as unknown as EventUser[]
}

export async function getEventDetail(id: string): Promise<EventDetail> {
  const client = await getAdminClient()
  const event = await client.items('events').readOne(id, {
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
  })
  const {
    name,
    description,
    datetime,
    datetime_end,
    status,
    type,
    visibility,
    cost,
    users: eventUsers,
    invite_only,
    location,
    survey,
  } = event

  const attendance = (eventUsers as EventUser[]) || []

  const detail: EventDetail = {
    id,
    name,
    description,
    datetime,
    datetime_end,
    status: status as EventStatusType,
    type,
    visibility,
    cost,
    attendance,
    invite_only,
    location: location as Location,
    stats: {
      invited_count: attendance.length,
      confirmed_count: attendance.filter((u) => u.rsvp === 'confirmed').length,
      maybe_count: attendance.filter((u) => u.rsvp === 'maybe').length,
      attended_count: attendance.filter((u) => u.attended).length,
      paid_count: attendance.filter((u) => u.paid).length,
    },
    members: attendance.map((u) => u.users_id as any as SearchableMember),
    surveys: survey as Survey[],
  }
  return detail
}
