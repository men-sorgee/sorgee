import {
  Applicant,
  applicantFields,
  EventInvite,
  EventUser,
  GroupEvent,
  Member,
  memberFields,
  MemberStats,
  Profile,
  profileFields,
  SearchableMember,
  searchableMemberFields,
  User,
  UserEmailEvent,
  UserFields,
  UserType
} from "lib/models";

import { FieldFilter } from "@directus/sdk";

import { getAdminClient } from "../";

function mapInvites<T extends User>(user: T): EventInvite[] {
  const invites = user.invites as EventUser[]
  return invites.map((invite: EventUser) => {
    const { events_id, users_id, ...rest } = invite
    const event = events_id as GroupEvent
    return {
      event,
      ...rest
    } as EventInvite
  })
}

export async function createUser(member: Partial<User>): Promise<User> {
  const adminClient = await getAdminClient()
  const user = await adminClient.items('users').createOne(member)
  if (!user) throw new Error('Failed to create user')
  return user as unknown as User
}

export async function updateUser<T extends User | Member | Applicant | Profile = User>(id: string, userData: Partial<T>) {
  const adminClient = await getAdminClient()

  const user = await adminClient.items('users').updateOne(id, userData)
  return user as T
}

export async function getUser<T extends User | Member | Applicant | Profile = User>(
  id: string,
  fields: UserFields = memberFields
): Promise<T | null> {
  const adminClient = await getAdminClient()
  const user = await adminClient.items('users').readOne(id, {
    fields: fields as any,
    filter: {
      status: {
        _eq: 'active',
      },
      invites: {
        rsvp: {
          _in: ['invited', 'confirmed', 'maybe'],
        },
        events_id: {
          status: {
            _in: ['scheduled', 'planned'],
          }
        }
      }
    },
    deep: {
      buddies: {
        _limit: -1,
      },
      buddy_of: {
        _limit: -1,
      },
      invites: {
        events_id: {
          _sort: ['datetime'],
        }
      }
    }
  })

  if (user.invites) {
    user.invites = mapInvites(user as any) as any
  }

  return user as T
}

export async function findUser<T extends User | Member | Applicant | Profile = Profile>(
  email: string,
  fields: UserFields = profileFields
): Promise<T | null> {
  const adminClient = await getAdminClient()
  console.dir({
    email,
  })
  const { data: users } = await adminClient.items('users').readByQuery({
    filter: {
      email: {
        _eq: email,
      },
    },
    fields
  })

  if (!users || !users.length) return null

  return users[0] as T
}



export async function searchUsers<T extends User | SearchableMember = SearchableMember>(
  filter: FieldFilter<T>,
  fields: UserFields = searchableMemberFields,
  limit: number = 20,
  page: number = 1,
  sort: any = '-last_login'
) {
  const adminClient = await getAdminClient()

  const results = await adminClient.items('users').readByQuery({
    filter: filter as any,
    fields,
    limit,
    page,
    meta: '*',
    sort,
  })
  return results
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  const adminClient = await getAdminClient()
  const applicant = await adminClient.items('users').readOne(id, { fields: applicantFields as any })
  return (applicant as unknown as Applicant) || null
}

export async function getMember(id: string): Promise<Member | null> {
  const adminClient = await getAdminClient()
  const member = await adminClient.items('users').readOne(id, {
    fields: memberFields as any,
  })
  return (member as unknown as Member) || null
}

export async function getUserId(email: string) {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('users').readByQuery({
    filter: { email: { _eq: email } },
    fields: ['id'],
  })

  if (data && data?.length) {
    return data[0].id
  }
  return null
}

export async function storeEmailEvent(event: UserEmailEvent) {
  const adminClient = await getAdminClient()

  return await adminClient.items('user_email_events').createOne(event)
}

export async function listUsersByLevel<T = Member>(
  type: string,
  fields: UserFields = memberFields
): Promise<T[]> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('users').readByQuery({
    filter: {
      user_type: {
        _eq: type,
      },
      status: {
        _in: ['new', 'active'],
      },
    },
    fields: [...fields],
  })
  return data as T[]
}


export async function getUserStats(start: string): Promise<{
  subscribers: number
  applicants: number
  pledges: number
  inductees: number
  brothers: number
  big_brothers: number
  staff: number
}> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.graphql.items<{
    users_aggregated: Array<{
      group: {
        user_type: UserType
      }
      count: {
        id: number
      }
    }>
  }>(`{
    users_aggregated(
      groupBy: ["user_type"]
      filter: {
          status: {
              _eq: "active"
          }
          date_created: {
              _gte: "${start}"
          }
      }
    ) {
      group
      count {
        id
      }
      avg {
        age
      }
      avgDistinct {
        weight
      }
    }
  }
  `)

  const { users_aggregated: stats } = data

  return {
    subscribers: stats.find((s) => s.group.user_type === 'subscriber')?.count.id || 0,
    applicants: stats.find((s) => s.group.user_type === 'applicant')?.count.id || 0,
    pledges: stats.find((s) => s.group.user_type === 'pledge')?.count.id || 0,
    inductees: stats.find((s) => s.group.user_type === 'inductee')?.count.id || 0,
    brothers: stats.find((s) => s.group.user_type === 'brother')?.count.id || 0,
    big_brothers: stats.find((s) => s.group.user_type === 'big_brother')?.count.id || 0,
    staff: stats.find((s) => s.group.user_type === 'staff')?.count.id || 0,
  } as MemberStats
}



export * from './billing';
export * from './blocks';
export * from './buddies';
export * from './invites';
export * from './likes';
export * from './ratings';
export * from './shares';
export * from './views';

