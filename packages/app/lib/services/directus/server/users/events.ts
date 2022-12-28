import { getAdminClient } from '../'
import { Invite, EventInviteRSVPType } from '@/lib/models'

export async function listUpcomingEvents() {
  const client = await getAdminClient()
  const events = await client.items('events').readByQuery({
    filter: {
      datetime: { _gte: new Date().toISOString() },
    },
  })
  return events.data
}

export async function findEventInvite(eventId: string, userId: string) {
  const client = await getAdminClient()
  const query = await client.items('events_users').readByQuery({
    filter: {
      events_id: { _eq: eventId },
      users_id: { _eq: userId },
    },
  })

  return query.data[0]
}

export async function listUserInvites(users_id: string): Promise<Invite[]> {
  const events = await listUpcomingEvents()
  const eventIds = events.map((event) => event.id)
  const client = await getAdminClient()
  const invites = await client.items('events_users').readByQuery({
    filter: {
      users_id: { _eq: users_id },
      events_id: {
        status: { _eq: 'scheduled' },
      },
    },
  })
  return (invites.data?.map((i: any) => {
    let event = events.find((e) => e.id === i.events_id)
    if (!event) return null
    return {
      id: event.id,
      name: event.name!,
      description: event.description,
      datetime: event.datetime,
      status: event.status,
      ...i,
    }
  }) || []) as Invite[]
}

export async function updateEventUserRSVP(
  eventId: string,
  userId: string,
  rsvp: EventInviteRSVPType,
  reason: string
) {
  const client = await getAdminClient()
  const invite = await findEventInvite(eventId, userId)

  if (!invite) {
    throw new Error('No invite found')
  }

  invite.rsvp = rsvp
  invite.reason = reason

  client.items('events_users').updateOne(invite.id, invite as any)

  return invite
}
