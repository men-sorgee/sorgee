import { getAdminClient } from '..'
import { Invite, InviteRSVPType, EventUser, GroupEvent, Location } from 'lib/models'

export async function getInvite(inviteId: number): Promise<EventUser | null> {
  const client = await getAdminClient()
  const query = await client.items('events_users').readOne(inviteId, {
    fields: ['*.*'],
  })

  return query as Invite
}

export async function findInvite(eventId: string, userId: string): Promise<EventUser | null> {
  const client = await getAdminClient()
  const query = await client.items('events_users').readByQuery({
    filter: {
      events_id: { _eq: eventId },
      users_id: { _eq: userId },
    },
  })

  return query.data[0] as EventUser
}

export async function listInvites(user_id: string): Promise<EventUser[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events_users').readByQuery({
    filter: {
      users_id: { _eq: user_id },
      events_id: { status: { _in: ['planned', 'scheduled', 'occurred'] } },
    },
    fields: ['*', 'events_id.*' as any, 'events_id.location.*' as any],
    sort: ['events_id.datetime' as any],
  })

  const invites = data.map((invite: EventUser) => {
    const today = new Date(new Date().toDateString())
    const event = invite.events_id as GroupEvent
    const eventDate = new Date(new Date(event.datetime).toDateString())
    if (today.getTime() != eventDate.getTime()) delete invite.events_id.location

    return invite
  })

  return (invites || []) as EventUser[]
}

export async function updateInvite(
  inviteId: number,
  data: Partial<{
    rsvp?: InviteRSVPType
    reason?: string
    attended?: boolean
    paid?: boolean
  }>
) {
  const client = await getAdminClient()
  const invite = await getInvite(inviteId)

  if (!invite) {
    throw new Error('No invite found')
  }

  const { rsvp, attended, reason, paid } = data

  if (rsvp) invite.rsvp = rsvp
  if (reason) invite.reason = reason
  if (attended !== undefined) invite.attended = attended
  if (paid !== undefined) invite.paid = paid
  delete invite.users_id
  delete invite.events_id

  await client.items('events_users').updateOne(inviteId, invite as any)

  return invite
}
