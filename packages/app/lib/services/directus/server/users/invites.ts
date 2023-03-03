import { listUpcomingEvents } from 'lib/services/directus/server'
import { getAdminClient } from '..'
import {
  Invite,
  InviteRSVPType,
  EventUser,
  GroupEvent,
  Location,
  EventInvite,
  Member,
  User,
} from 'lib/models'

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

export async function listInvites(member: Member): Promise<EventUser[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events_users').readByQuery({
    filter: {
      users_id: { _eq: member.id },
      events_id: {
        status: { _in: ['planned', 'scheduled', 'occurred'] },
      },
    },
    fields: ['*.*' as any, 'events_id.*' as any, 'events_id.users.*' as any],
    sort: ['events_id.datetime' as any],
  })

  const invites = data.map((invite: EventUser): Partial<EventInvite> => {
    const event = invite.events_id as GroupEvent
    const member = invite.users_id as unknown as Member
    const rsvp = invite.rsvp as InviteRSVPType
    const { id, attended, paid, guest, reason } = invite
    return {
      id,
      event,
      member,
      rsvp,
      attended,
      paid,
      guest,
      reason,
    }
  })

  const events = await listUpcomingEvents(member.user_type)
  events.forEach((event) => {
    const invite = invites.find((i) => i.event.id === event.id)
    if (!invite) {
      invites.push({
        event,
        rsvp: 'invited',
        member: member,
      })
    }
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
