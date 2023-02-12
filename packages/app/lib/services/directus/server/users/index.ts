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
  UserPhoto,
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
        _nin: ['deleted', 'banned'],
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

export async function searchUsers<T = Member>(
  filter: FieldFilter<T>,
  fields: UserFields = memberFields,
  limit: number = 20,
  offset: number = 0,
  sort: any
) {
  const adminClient = await getAdminClient()
  const results = await adminClient.items('users').readByQuery({
    filter,
    fields,
    limit,
    offset,
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
        _eq: 'active',
      },
    },
    fields: [...fields],
  })
  return data as T[]
}

export * from './auth'
export * from './invites'
export * from './notifications'
