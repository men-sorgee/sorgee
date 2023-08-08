import {
  EventInvite,
  EventUser,
  GroupEvent,
  Invite,
  InviteRSVPType,
  Member
} from "lib/models";
import { listUpcomingEvents } from "lib/services/directus/server";

import { getAdminClient } from "../";

export async function getInvite(inviteId: number): Promise<EventUser | null> {
  const client = await getAdminClient()
  const query = await client.items('events_users').readOne(inviteId, {
    fields: ['*', 'events_id.*', 'users_id.*'],
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

  return query.data ? query.data[0] as EventUser : null
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
    fields: ['*', '*.*' as any, 'events_id.*' as any],
    sort: ['events_id.datetime' as any],
  })

  let invites = data.map((invite: EventUser): Partial<EventInvite> => {
    const event = invite.events_id as GroupEvent
    const member = invite.users_id as unknown as Member
    const rsvp = invite.rsvp as InviteRSVPType
    const { id, attended, paid, guest, reason, amount } = invite
    return {
      id,
      event,
      member,
      rsvp,
      attended,
      paid,
      amount,
      guest,
      reason,
    }
  })

  if (member.event_invites == false) {
    invites = invites.filter((i: EventInvite) => i.rsvp !== 'invited')
    return invites as EventUser[]
  }

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
  data: Partial<EventUser>
) {
  const client = await getAdminClient()
  let invite = await getInvite(inviteId)
  if (!invite) {
    throw new Error('No invite found')
  }
  invite = await client.items('events_users').updateOne(inviteId, data) as EventUser

  return invite
}

export async function getUserEvents(user_id: string) {
  const client = await getAdminClient()
  const { data } = await client.items('events_users').readByQuery({
    filter: {
      users_id: { _eq: user_id },
    },
    fields: ['*', '*.*' as any, 'events_id.*' as any],
    sort: ['events_id.datetime' as any],
  })

  return data as EventUser[]
}
