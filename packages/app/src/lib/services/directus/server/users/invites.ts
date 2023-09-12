import {
  EventInvite,
  EventUser,
  GroupEvent,
  Invite,
  Member,
  UserType
} from "lib/models";

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
    fields: ['*'],
  })

  return query.data ? query.data[0] as EventUser : null
}

export async function listInvites(member: Member): Promise<EventInvite[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events_users').readByQuery({
    filter: {
      users_id: { _eq: member.id },
      events_id: {
        status: { _in: ['planned', 'scheduled', 'occurred'] },
      },
    },
    fields: ['*', '*.*', 'events_id.*'],
    events_id: {
      _limit: -1,
      sort: ['datetime'],
    }
  })

  let invites: EventInvite[] = data.map(e => {
    const event = e.events_id as GroupEvent
    return {
      event,
      ...e
    } as any
  })

  if (member.event_invites == false) {
    return invites.filter((i) => i.rsvp !== 'invited')
  }

  const events = await listUpcomingEvents(member.user_type)
  events.forEach((event) => {
    const invite = invites.find((i) => i.event.id === event.id)
    if (!invite && event.status == 'scheduled' && event.invite_only == false) {
      invites.push({
        event,
        member,
        rsvp: 'invited',
      })
    }
  })
  return invites || []
}

export async function listUpcomingEvents(user_type: UserType): Promise<GroupEvent[]> {
  const client = await getAdminClient()
  const { data = [] } = await client.items('events').readByQuery({
    filter: {
      status: { _in: ['scheduled', 'planned'] },
      datetime: { _gte: '$NOW(-1 days)' },
      invite_only: { _eq: false },
    },
    fields: ['*.*'],
    sort: ['datetime'],
  })
  return (data.filter((e) => e.visibility?.includes(user_type)) || []) as unknown as GroupEvent[]
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

export async function getUserInvites(user_id: string): Promise<EventInvite[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events_users').readByQuery({
    filter: {
      users_id: { _eq: user_id },
    },
    fields: ['*', '*.*' as any, 'events_id.*' as any],
    sort: ['events_id.datetime' as any],
  })

  return data.map(mapInvite)
}

function mapInvite(event: EventUser): EventInvite {
  const { events_id, users_id, ...rest } = event
  const eventDetail = events_id as GroupEvent
  const member = users_id as Member
  return {
    event: eventDetail,
    member,
    ...rest
  } as EventInvite
}
