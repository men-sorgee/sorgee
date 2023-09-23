import {
  Applicant,
  applicantFields,
  Member,
  memberFields,
  MemberSearchResults,
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
import { getAdminClient } from "lib/services/directus/server";

// Service Calls ------------------------------------
import {
  aggregate,
  createItem,
  readItem,
  readItems,
  updateItem
} from "@directus/sdk";

export async function createUser(member: Partial<User>): Promise<User> {
  const admin = getAdminClient()
  const user = await admin.request<User>(createItem('users', member))
  if (!user) throw new Error('Failed to create user')
  return user as unknown as User
}

export async function updateUser<T extends User | Member | Applicant | Profile = User>(id: string, userData: Partial<T>) {
  const admin = getAdminClient()

  const user = await admin.request<T>(updateItem('users', id, userData))
  return user as T
}

export async function getUser<T extends User | Member | Applicant | Profile = User>(
  id: string,
  fields: UserFields = memberFields
): Promise<T> {
  const admin = getAdminClient()
  const user = await admin.request<User>(readItem('users', id, {
    fields: fields as any,
    filter: {
      status: {
        _eq: 'active',
      },
    },
    deep: {
      buddies: {
        _limit: -1,
      },
      buddy_of: {
        _limit: -1
      },
      invites: {
        events_id: {
          _sort: ['datetime'],
        }
      }

    },
  }))
  return user as T
}

export async function findUser<T extends User | Member | Applicant | Profile = Profile>(
  email: string,
  fields: UserFields = profileFields
): Promise<T> {
  const admin = getAdminClient()
  const users = await admin.request<User[]>(readItems('users', {
    filter: {
      email: {
        _eq: email,
      },
    },
    fields: [...fields],
  }))

  if (!users || !users.length) return null

  return users[0] as T
}


export async function searchUsers<T extends User | SearchableMember = SearchableMember>(
  filter: any,
  fields: UserFields = searchableMemberFields,
  limit: number = 20,
  page: number = 1,
  sort: any = '-last_login'
): Promise<MemberSearchResults<T>> {
  const admin = getAdminClient()

  const data = await admin.request<T[]>(readItems('users', {
    filter,
    fields: [...fields,],
    limit,
    page,
    meta: '*',
    sort,
  }))

  const meta = await admin.request<{ count: number }>(aggregate('users', {
    aggregate: {
      count: '*',
    },
    filter,
  }))
  return {
    data,
    meta: {
      total: meta.count,
      count: data.length,
    }
  }
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  const admin = getAdminClient()
  return admin.request<Applicant>(readItem('users', id, { fields: applicantFields as any }))
}

export async function getMember(id: string): Promise<Member | null> {
  const admin = getAdminClient()
  return await admin.request<Member>(readItem('users', id, {
    fields: memberFields,
  }))
}

export async function getUserId(email: string) {
  const admin = getAdminClient()
  const data = await admin.request<Pick<User, 'id'>[]>(readItems('users', {
    filter: { email: { _eq: email } },
    fields: ['id'],
  }))

  if (data && data?.length) {
    return data[0].id
  }
  return null
}

export async function storeEmailEvent(event: UserEmailEvent) {
  const admin = getAdminClient()

  return admin.request<UserEmailEvent>(createItem('user_email_events', event))
}

export async function listUsersByLevel<T extends Applicant = Member>(
  type: UserType,
  fields: UserFields = memberFields
): Promise<T[]> {
  const admin = getAdminClient()
  return admin.request<T[]>(readItems('users', {
    filter: {
      user_type: {
        _eq: type,
      },
      status: {
        _in: ['new', 'active'],
      },
    },
    fields: [...fields],
  }))
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
  const admin = getAdminClient()
  const data = await admin.query<{
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

