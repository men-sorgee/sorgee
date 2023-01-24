import { getAdminClient } from '.'
import { Event, EventDetail, EventUser } from '../../../models'

export async function listUpcomingEvents(): Promise<EventDetail[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events').readByQuery({
    filter: {
      status: { _eq: 'scheduled' },
    },
    fields: ['*.*'],
  })
  return data as EventDetail[]
}

export async function listEvents() {
  const client = await getAdminClient()
  const { data } = await client.items('events').readByQuery({
    filter: {
      status: { _in: ['scheduled', 'occurred'] },
    },
    fields: ['*.*'],
    sort: ['-datetime'],
  })
  return data as EventDetail[]
}

export async function getEvent(id: string): Promise<EventDetail> {
  const client = await getAdminClient()
  const event: Event = await client.items('events').readOne(id, { fields: ['*', 'users.*' as any] })
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
