import { getAdminClient } from '.'
import { GroupEvent, EventDetail, EventUser, UserType, InviteRSVPType } from 'lib/models'

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
    status: { _in: ['scheduled', 'occurred'] },
  }
  const { data } = await client.items('events').readByQuery({
    filter,
    fields: ['*.*'],
    sort: ['-datetime'],
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

export async function getEvent(id: string): Promise<EventDetail> {
  const client = await getAdminClient()
  const event: GroupEvent = await client
    .items('events')
    .readOne(id, { fields: ['*', 'users.*' as any] })
  const { users: eventUsers, ...eventData } = event
  const users = (eventUsers as EventUser[]) || []
  return {
    ...eventData,
    users,
    invited_count: users.length,
    confirmed_count: users.filter((u) => u.rsvp === 'confirmed').length,
    maybe_count: users.filter((u) => u.rsvp === 'maybe').length,
    attended_count: users.filter((u) => u.attended).length,
    paid_count: users.filter((u) => u.paid).length,
  }
}
