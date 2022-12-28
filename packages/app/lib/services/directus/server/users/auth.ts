import { getAdminClient } from '../'
import { User, UserAccount, UserSession, UserVerificationToken } from 'lib/models'

export async function recordUserLogin(id: string) {
  const adminClient = await getAdminClient()
  return await adminClient.items('users').updateOne(id, {
    last_login: new Date().toISOString(),
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

export async function createSession(session: UserSession) {
  const adminClient = await getAdminClient()
  const { id } = await adminClient.items('user_session').createOne(session)
  return adminClient.items('user_session').readOne(id, {
    fields: ['*', 'user.*'],
  })
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

export async function updateSession(session: UserSession) {
  const adminClient = await getAdminClient()
  const { id } = await adminClient.items('user_session').updateOne(session.id, {
    expires: session.expires,
  })
  return adminClient.items('user_session').readOne(id, {
    fields: ['*', 'user.*'],
  })
}

export async function deleteSession(token: string) {
  const adminClient = await getAdminClient()
  const session = await findSession(token)
  return await adminClient.items('user_session').deleteOne(session.id)
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

export async function findVerificationToken(email: string) {
  const adminClient = await getAdminClient()
  const tokens = await adminClient.items('user_verification_token').readByQuery({
    filter: {
      email: { _eq: email },
    },
  })
  return tokens?.data?.length ? (tokens.data[0] as UserVerificationToken) : null
}

export async function deleteVerificationToken(email: string) {
  const adminClient = await getAdminClient()
  const token = await findVerificationToken(email)
  return await adminClient.items('user_verification_token').deleteOne(token.id)
}
