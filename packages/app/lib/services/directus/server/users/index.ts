import { Rating, RatingCollection, UserType } from 'lib/models'
// Service Calls ------------------------------------

import { getAdminClient } from '..'
import {
  User,
  memberFields,
  profileFields,
  Profile,
  Member,
  Applicant,
  applicantFields,
  UserEmailEvent,
  UserFields,
} from 'lib/models'
import { FieldFilter } from '@directus/sdk'

export async function createUser(member: Partial<User>): Promise<User> {
  const adminClient = await getAdminClient()
  const user = await adminClient.items('users').createOne(member)
  if (!user) throw new Error('Failed to create user')
  return user as User
}

export async function updateUser(id: string, member: Partial<User>): Promise<User> {
  const adminClient = await getAdminClient()
  const user = await adminClient.items('users').updateOne(id!, member)
  return user as User
}

export async function getUser<T = User>(
  id: string,
  fields: UserFields = memberFields
): Promise<T | null> {
  const adminClient = await getAdminClient()
  const user: any = await adminClient.items('users').readOne(id, {
    fields: fields as any,
    filter: {
      status: {
        _nin: ['inactive', 'banned'],
      },
    },
  })
  return (user as T) || null
}

export async function findUser<T = Profile>(
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

export async function searchUsers<T = User>(
  filter: FieldFilter<T>,
  fields: UserFields = memberFields,
  limit: number = 20,
  page: number = 1,
  sort: any = '-last_login'
) {
  const adminClient = await getAdminClient()

  const results = await adminClient.items('users').readByQuery({
    filter,
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
  return (applicant as Applicant) || null
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

export async function getRating(user_id: string, collection: RatingCollection, item_id: string) {
  const adminClient = await getAdminClient()
  const filter = {
    user: {
      _eq: user_id,
    },
    collection: {
      _eq: collection,
    },
  }
  switch (collection) {
    case 'events': {
      filter['event'] = {
        _eq: item_id,
      }
      break
    }
    case 'users': {
      filter['member'] = {
        _eq: item_id,
      }
      break
    }
  }

  const { data: ratings } = await adminClient.items('rating').readByQuery({
    filter,
  })

  if (ratings && ratings.length > 0) {
    return ratings[0] as Rating
  } else {
    return null
  }
}

export async function getRatings(user_id: string) {
  const adminClient = await getAdminClient()

  const { data: ratings } = await adminClient.items('rating').readByQuery({
    filter: {
      user: {
        _eq: user_id,
      },
    },
  })

  return ratings as Rating[]
}

export async function setRating(
  user_id: string,
  collection: RatingCollection,
  item: string,
  rate: number
) {
  const adminClient = await getAdminClient()
  const existingRating = await getRating(user_id, collection, item)
  if (existingRating) {
    return (await adminClient.items('rating').updateOne(existingRating.id, {
      rate,
    })) as Rating
  } else {
    let value = {} as Partial<Rating>
    switch (collection) {
      case 'events': {
        value.event = item
        break
      }
      case 'users': {
        value.member = item
        break
      }
    }
    return (await adminClient.items('rating').createOne({
      user: user_id,
      collection,
      rate,
      ...value,
    })) as Rating
  }
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

export type MemberStats = {
  subscribers: number
  applicants: number
  pledges: number
  inductees: number
  brothers: number
  big_brothers: number
  staff: number
}

export * from './auth'
export * from './invites'
export * from './relations'
