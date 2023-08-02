import {
  Applicant,
  applicantFields,
  Member,
  memberFields,
  Profile,
  profileFields,
  User,
  UserEmailEvent,
  UserFields,
  UserType,
  MemberStats,
  searchableMemberFields,
  SearchableMember,
  UserView
} from 'lib/models'

import { FieldFilter } from '@directus/sdk'

// Service Calls ------------------------------------
import { getAdminClient } from '../'

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
    },
    deep: {
      buddies: {
        _limit: -1,
      },
      buddy_of: {
        _limit: -1,
      }

    },
  })
  return (user as T) || null
}

export async function findUser<T extends User | Member | Applicant | Profile = Profile>(
  email: string,
  fields: UserFields = profileFields
): Promise<T | null> {
  const adminClient = await getAdminClient()
  // @ts-ignore
  const existingUserQuery = await adminClient.items('users').readByQuery({
    filter: {
      email: {
        _eq: email,
      },
    },
    fields: [...fields],
  })

  // @ts-ignore
  const user = existingUserQuery?.data?.length ? existingUserQuery.data[0] : null

  return user as T
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
  if (event.email) event.user = (await getUserId(event.email)) || null
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



export async function getUserViews(user_id: string): Promise<UserView[]> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('user_views').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      }
    },
    fields: ['*'],
    sort: '-date_created',
  })
  return data as UserView[]
}

export async function addUserView(user_id: string, viewed_id: string): Promise<void> {
  const admin = await getAdminClient()

  const { data: existingItems } = await admin.items('user_views').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      viewed_id: {
        _eq: viewed_id,
      },
    },
    fields: ['id', 'count'],
  })

  if (existingItems?.length == 0) {
    await admin.items('user_views').createOne({
      user_id,
      viewed_id,
    })
  } else {
    await admin.items('user_views').updateOne(existingItems[0].id, {
      count: existingItems[0].count + 1,
    })
  }
}

export * from './invites'
export * from './buddies'
export * from './shares'
export * from './likes'
export * from './blocks'
export * from './ratings'
