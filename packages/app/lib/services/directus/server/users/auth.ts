import { getAdminClient, updateUser } from '..'
import { User, UserAccount, UserSession, UserVerificationToken } from 'lib/models'
import { addHours } from 'date-fns'

export async function recordUserLogin(id: string) {
  const adminClient = await getAdminClient()
  const now = addHours(new Date(), new Date().getTimezoneOffset() / 60)
  return await adminClient.items('users').updateOne(id, {
    presence: 'online',
    last_login: now.toISOString(),
    session_expire: addHours(now, 3).toISOString(),
  })
}

export async function extendUserPresence(id: string) {
  const now = addHours(new Date(), new Date().getTimezoneOffset() / 60)
  await updateUser(id, {
    presence: 'online',
    session_expire: addHours(now, 3).toISOString(),
  })
  await expireSessions()
}

export async function expireSessions() {
  const now = addHours(new Date(), new Date().getTimezoneOffset() / 60)
  const adminClient = await getAdminClient()
  const { data: expired } = await adminClient.items('users').readByQuery({
    filter: {
      session_expire: { _lt: now.toISOString() },
      presence: { _eq: 'online' },
    },
    fields: ['id'],
  })

  if (!expired?.length) return
  const ids = expired.map((u) => u.id)

  return await adminClient.items('users').updateMany(ids, {
    presence: 'offline',
  })
}

export async function findUserByAccount(provider: string, id: string): Promise<User | null> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('user_account').readByQuery({
    filter: {
      provider: { _eq: provider },
      provider_id: { _eq: id },
    },
    fields: '*, user.*' as any,
  })
  return data?.length ? (data[0].user as User) : null
}

export async function createAccount(account: UserAccount) {
  const adminClient = await getAdminClient()
  return await adminClient.items('user_account').createOne(account)
}

export async function deleteAccount(provider: string, id: string) {
  const adminClient = await getAdminClient()
  const user = await findUserByAccount(provider, id)
  if (!user) return
  return await adminClient.items('user_account').deleteOne(user?.id)
}

export async function createSession(session: Omit<UserSession, 'id'>) {
  const adminClient = await getAdminClient()
  const { id } = await adminClient.items('user_session').createOne(session)
  const newSession = await adminClient.items('user_session').readOne(id, {
    fields: ['*', 'user.*'],
  })
  return newSession
}

export async function findSession(token: string): Promise<UserSession> {
  const adminClient = await getAdminClient()
  const sessions = await adminClient.items('user_session').readByQuery({
    filter: {
      session_token: { _eq: token },
    },
    fields: '*, user.*' as any,
  })
  return sessions?.data?.length ? (sessions.data[0] as UserSession) : null
}

export async function updateSession(session: Omit<UserSession, 'id'>) {
  const adminClient = await getAdminClient()
  const existing = await findSession(session.session_token)
  if (!existing) return createSession(session)
  await adminClient.items('user_session').updateOne(existing.id, {
    session_token: session.session_token,
    user: session.user,
    expires: session.expires,
  })
  return existing
}

export async function deleteSession(token: string) {
  console.log('deleteSession', token)
  const adminClient = await getAdminClient()
  const session = await findSession(token)
  if (session) await adminClient.items('user_session').deleteOne(session.id)
}

export async function addVerificationToken(
  email: string,
  token: string,
  expires: string
): Promise<UserVerificationToken> {
  const adminClient = await getAdminClient()
  const verificationToken = await adminClient.items('user_verification_token').createOne({
    email,
    token,
    expires,
  })
  return verificationToken as UserVerificationToken
}

export async function findVerificationToken(email: string, token?: string) {
  const adminClient = await getAdminClient()
  const filter = {
    email: { _eq: email },
    expires: { _gt: '$NOW' },
  }
  if (token) filter['token'] = { _eq: token }

  const tokens = await adminClient.items('user_verification_token').readByQuery({
    filter,
  })

  expireOldVerificationTokens().catch((e) => console.error(e))

  return tokens?.data?.length ? (tokens.data[0] as UserVerificationToken) : null
}

export async function expireOldVerificationTokens() {
  const adminClient = await getAdminClient()
  const { data: expired } = await adminClient.items('user_verification_token').readByQuery({
    filter: {
      expires: { _lt: '$NOW' },
    },
    fields: ['id'],
  })

  if (!expired?.length) return
  const ids = expired.map((u) => u.id)

  return await adminClient.items('user_verification_token').deleteMany(ids)
}

export async function deleteVerificationToken(email: string) {
  const adminClient = await getAdminClient()
  const token = await findVerificationToken(email)
  return await adminClient.items('user_verification_token').deleteOne(token.id)
}
