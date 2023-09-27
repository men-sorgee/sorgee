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
  const admin = getAdminClient()
  const query = await admin.request<Invite>(readItem('events_users', inviteId, {
    fields: ['*',
      { events_id: ['*'] },
      { users_id: ['*'] }
    ],

  }))

  return query as Invite
}

export async function findInvite(eventId: string, userId: string): Promise<EventUser | null> {
  const admin = getAdminClient()
  const invites = await admin.request<EventUser[]>(readItems('events_users', {
    filter: {
      events_id: { _eq: eventId },
      users_id: { _eq: userId },
    },
    fields: ['*', { events_id: ['*'] }],
    limit: -1,
  }))

  return invites.length ? invites[0] : null
}

export async function listInvites(member: Member): Promise<EventInvite[]> {
  const admin = getAdminClient()
  const data = await admin.request(readItems('events_users', {
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
    const invite = invites.find(i => i.event.id === event.id)
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
  const admin = getAdminClient()
  const data = await admin.request<GroupEvent[]>(readItems('events', {
    filter: {
      status: { _in: ['scheduled', 'planned'] },
      datetime: { _gte: '$NOW(-1 days)' },
      invite_only: { _eq: false },
    },
    fields: ['*', {
      invites: ['*', {
        users_id: ['*']
      }]
    }],
    sort: ['datetime'],
  }))
  return data.filter((e) => e.visibility?.includes(user_type)) || []
}

export async function updateInvite(
  inviteId: number,
  data: Partial<EventUser>
) {
  const admin = getAdminClient()
  let invite = await getInvite(inviteId)
  if (!invite) {
    throw new Error('No invite found')
  }
  return await admin.request(updateItem('events_users', inviteId, data)) as EventUser
}

export async function getUserEvents(user_id: string) {
  const admin = getAdminClient()
  const data = await admin.request<EventUser[]>(readItems('events_users', {
    filter: {
      users_id: { _eq: user_id },
    },
    fields: ['*', '*.*' as any, 'events_id.*' as any],
    sort: ['events_id.datetime' as any],
  }))
  return data as EventUser[]
}
