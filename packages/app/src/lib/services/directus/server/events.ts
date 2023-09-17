import {
  EventDetail,
  EventStatusType,
  EventUser,
  GroupEvent,
  InviteRSVPType,
  Location,
  Member,
  Survey
} from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

export async function listAdminEvents(): Promise<GroupEvent[]> {
  const client = await getAdminClient()
  const filter = {
    status: { _in: ['scheduled', 'occurred', 'planned'] },
  }
  const { data } = await client.items('events').readByQuery({
    filter,
    fields: ['*.*'],
    sort: ['datetime'],
    deep: {
      invites: {
        _limit: -1,
      }
    }
  })
  if (!data || data.length == 0) return []
  return data as unknown as GroupEvent[]
}

export async function registerForEvent(
  event_id: string,
  user_id: string,
  rsvp: InviteRSVPType,
  paid_at: string = undefined
): Promise<EventUser> {
  const client = await getAdminClient()
  const invite = await client.items('events_users').createOne({
    events_id: event_id,
    users_id: user_id,
    rsvp,
    paid_at
  })
  return invite as unknown as EventUser
}

const userFields: Array<keyof Member> = [
  'nickname', 'picture', 'id', 'email',
  'show_profile', 'biography', 'user_type',
  'date_created', 'last_login', 'location']

export async function getEvent(id: string, filter?: any): Promise<GroupEvent> {
  const client = await getAdminClient()
  const event = (await client.items('events').readOne(id, {
    fields: [
      '*',
      'location.*',
      'invites.*',
      ...userFields.map((f) => `invites.users_id.${f}`),
      'survey.*'
    ] as any,
    deep: {
      invites: {
        _limit: -1,
      },
      survey: {
        status: {
          _eq: 'published'
        }
      }
    },
    filter: filter || {},
  })) as any as GroupEvent
  if (!event) return null
  return event as GroupEvent
}

export async function updateEvent(id: string, data: Partial<GroupEvent>): Promise<GroupEvent> {
  const client = await getAdminClient()
  const event = await client.items('events').updateOne(id, data)
  return event as unknown as GroupEvent
}

export async function updateEventUsers(ids: number[], data: Partial<EventUser>): Promise<EventUser[]> {
  const client = await getAdminClient()
  const attendees = await client.items('events_users').updateMany(ids, data)
  return attendees as unknown as EventUser[]
}

export async function getEventDetail(id: string): Promise<EventDetail> {
  const client = await getAdminClient()
  const event = await client.items('events').readOne(id, {
    fields: [
      '*',
      'location.*',
      'invites.*',
      ...userFields.map((f) => `invites.users_id.${f}`),
      'survey.*'
    ] as any,
    deep: {
      invites: {
        _limit: -1,
      },
      survey: {
        status: {
          _eq: 'published'
        }
      }
    },
  })
  const {
    name,
    description,
    datetime,
    datetime_end,
    start,
    end,
    status,
    type,
    visibility,
    cost,
    invites,
    invite_only,
    location: l,
    online_payments,
    survey,
  } = event

  const location = l as unknown as Location
  const attendance = invites as unknown as EventUser[]

  const detail: EventDetail = {
    id,
    name,
    description,
    datetime,
    datetime_end,
    start,
    end,
    status: status as EventStatusType,
    type,
    visibility,
    cost,
    attendance,
    invite_only,
    online_payments,
    location,
    expenses: event.expenses,
    stats: {
      invited_count: attendance.length,
      confirmed_count: attendance.filter((u) => u.rsvp === 'confirmed').length,
      maybe_count: attendance.filter((u) => u.rsvp === 'maybe').length,
      attended_count: attendance.filter((u) => u.attended).length,
      paid_count: attendance.filter((u) => u.paid).length,
      prepaid_count: attendance.filter((u) => u.payment).length,
      cash_count: attendance.filter((u) => u.paid).length - attendance.filter((u) => u.payment).length
    },
    //members: attendance.map((u) => u.users_id as any as SearchableMember),
    surveys: survey as Survey[]
  }
  return detail
}
