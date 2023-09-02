import {
  EventInvite,
  EventUser,
  GroupEvent,
  Invite,
  Member,
  UserType
} from "lib/models";

import { readItem, readItems, updateItem } from "@directus/sdk";

import { getAdminClient } from "../";

export async function getInvite(inviteId: number): Promise<EventUser | null> {
  const admin = await getAdminClient()
  const query = await client.request<Invite>(readItem('events_users', inviteId, {
    fields: ['*',
      { events_id: ['*'] },
      { users_id: ['*'] }
    ],

  }))

  return query as Invite
}

export async function findInvite(eventId: string, userId: string): Promise<EventUser | null> {
  const admin = await getAdminClient()
  const query = await client.request(readItems('events_users', {
    filter: {
      events_id: { _eq: eventId },
      users_id: { _eq: userId },
    },
    fields: ['*'],
  }))

  return query ? query[0] as EventUser : null
}

export async function listInvites(member: Member): Promise<EventUser[]> {
  const admin = await getAdminClient()
  const data = await client.request(readItems('events_users', {
    filter: {
      users_id: { _eq: member.id },
      events_id: {
        status: { _in: ['planned', 'scheduled', 'occurred'] },
      },
    },
    fields: ['*',
      { events_id: ['*'] },
      { users_id: ['*'] },
    ],
    sort: ['events_id.datetime' as any],
  }))

  let invites = data.map((invite: EventUser): Partial<EventInvite> => {
    const { events_id, users_id, ...rest } = invite
    const event = events_id as GroupEvent
    const member = users_id as Member
    return {
      event,
      member,
      ...rest
    }
  })

  if (member.event_invites == false) {
    invites = invites.filter((i: EventInvite) => i.rsvp !== 'invited')
    return invites as EventUser[]
  }

  const events = await listUpcomingEvents(member.user_type)
  events.forEach((event) => {
    const invite = invites.find(i => i.event.id === event.id)
    if (!invite && event.status == 'scheduled' && event.invite_only == false) {
      invites.push({
        event,
        member,
        rsvp: 'invited',
      })
    }
  })
  return (invites || []) as EventUser[]
}

export async function listUpcomingEvents(user_type: UserType): Promise<GroupEvent[]> {
  const admin = await getAdminClient()
  const data = await client.request(readItems('events', {
    filter: {
      status: { _in: ['scheduled', 'planned'] },
      datetime: { _gte: '$NOW(-1 days)' },
      invite_only: { _eq: false },
    },
    fields: ['*', {
      users: ['*', {
        users_id: ['*']
      }]
    }],
    sort: ['datetime'],
  }))
  //if (user_type == 'staff') return data as unknown as GroupEvent[]
  return (data.filter((e) => e.visibility?.includes(user_type)) || []) as unknown as GroupEvent[]
}

export async function updateInvite(
  inviteId: number,
  data: Partial<EventUser>
) {
  const admin = await getAdminClient()
  let invite = await getInvite(inviteId)
  if (!invite) {
    throw new Error('No invite found')
  }
  invite = await client.request(updateItem('events_users', inviteId, data)) as EventUser

  return invite
}

export async function getUserEvents(user_id: string) {
  const admin = await getAdminClient()
  const data = await client.request<EventUser[]>(readItems('events_users', {
    filter: {
      users_id: { _eq: user_id },
    },
    fields: ['*', '*.*' as any, 'events_id.*' as any],
    sort: ['events_id.datetime' as any],
  }))
  return data as EventUser[]
}
