import { getAdminClient } from '.'
import {
  GroupEvent,
  EventDetail,
  EventUser,
  UserType,
  InviteRSVPType,
  User,
  SearchableMember,
  EventStatusType,
} from 'lib/models'

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
  if (user_type == 'admin' || user_type == 'staff') return data as unknown as GroupEvent[]
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

export async function getEvent(id: string): Promise<GroupEvent> {
  const client = await getAdminClient()
  const event: GroupEvent = (await client.items('events').readOne(id)) as any as GroupEvent
  if (!event) return null
  return event as GroupEvent
}

export async function getEventDetail(id: string): Promise<EventDetail> {
  const client = await getAdminClient()
  const event: GroupEvent = await client
    .items('events')
    .readOne(id, { fields: ['*', 'users.*' as any, , 'users.users_ud.*' as any] })
  const {
    datetime,
    name,
    description,
    status,
    type,
    visibility,
    cost,
    users: eventUsers,
    invite_only,
  } = event
  const attendance = (eventUsers as EventUser[]) || []
  const detail: EventDetail = {
    id,
    name,
    description,
    datetime,
    status: status as EventStatusType,
    type,
    visibility,
    cost,
    attendance,
    invite_only,
    stats: {
      invited_count: attendance.length,
      confirmed_count: attendance.filter((u) => u.rsvp === 'confirmed').length,
      maybe_count: attendance.filter((u) => u.rsvp === 'maybe').length,
      attended_count: attendance.filter((u) => u.attended).length,
      paid_count: attendance.filter((u) => u.paid).length,
    },
    members: attendance.map((u) => u.users_id as SearchableMember),
  }
  return detail
}
