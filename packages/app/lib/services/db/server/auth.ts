import { getRepository } from './data-source'
import { User, UserAccount, UserSession, UserVerificationToken } from '../entities'
import { addHours } from 'date-fns'
import { LessThan, MoreThan } from 'typeorm'
import { getUTCNow } from 'lib/utils'
import { randomUUID } from 'crypto'

export async function recordUserLogin(id: string) {
  const repo = await getRepository(User)
  const now = getUTCNow()
  return await repo.update(
    { id },
    {
      presence: 'online',
      lastLogin: now,
      sessionExpire: addHours(now, 3),
    }
  )
}

export async function extendUserPresence(id: string) {
  const repo = await getRepository(User)
  const now = getUTCNow()
  await repo.update(
    { id },
    {
      presence: 'online',
      sessionExpire: addHours(now, 3),
    }
  )
  await expireSessions()
}

export async function expireSessions() {
  const repo = await getRepository<User>(User)
  const now = addHours(getUTCNow(), -4)
  const expired = await repo.find({
    select: ['id'],
    where: {
      sessionExpire: LessThan(now),
      presence: 'online',
    },
  })

  if (!expired?.length) return
  const ids = expired.map((u) => u.id)

  return await repo.update(ids, {
    presence: 'offline',
  })
}

export async function findUserByAccount(provider: string, id: string): Promise<User | null> {
  const repo = await getRepository(UserAccount)
  const account = await repo.findOne({
    where: {
      provider: provider,
      providerId: id,
    },
    relations: ['user'],
  })
  return (account?.user as User) || null
}

export async function createAccount(account: Partial<UserAccount>) {
  const repo = await getRepository(UserAccount)
  return await repo.save(account)
}

export async function deleteAccount(provider: string, id: string) {
  const repo = await getRepository(UserAccount)
  const user = await findUserByAccount(provider, id)
  if (!user) return
  return await repo.delete(user)
}

export async function createSession(session: UserSession) {
  const repo = await getRepository(UserSession)
  return await repo.save({
    ...session,
    id: randomUUID(),
  })
}

export async function findSession(token: string): Promise<UserSession> {
  const repo = await getRepository(UserSession)
  const session = await repo.findOne({
    where: {
      sessionToken: token,
    },
    relations: ['user'],
  })
  return session
}

export async function updateSession(sessionToken: string, expires: Date) {
  const repo = await getRepository(UserSession)
  await repo.update(
    {
      sessionToken,
    },
    {
      expires,
    }
  )
  return await repo.findOne({
    where: { sessionToken },
    relations: ['user'],
  })
}

export async function deleteSession(token: string) {
  const repo = await getRepository(UserSession)
  const session = await findSession(token)
  if (!session) return

  const { id: userId } = session.user as User
  await repo.delete(session.id)

  const users = await getRepository(User)
  await users.update(
    { id: userId },
    {
      presence: 'offline',
    }
  )
}

export async function addVerificationToken(
  email: string,
  token: string,
  expires: string
): Promise<UserVerificationToken> {
  const repo = await getRepository(UserVerificationToken)
  const verificationToken = repo.create({
    email,
    token,
    expires,
  })
  let id = await repo.insert(verificationToken)
  return await repo.findOne(id.identifiers[0]['id'])
}

export async function findVerificationToken(email: string, token?: string) {
  const repo = await getRepository(UserVerificationToken)
  const now = new Date()
  const where = {
    email,
    expires: MoreThan(now),
  }
  if (token) where['token'] = token

  const verificationToken = await repo.findOne({
    where,
  })

  expireOldVerificationTokens().catch((e) => console.error(e))

  return verificationToken || null
}

export async function expireOldVerificationTokens() {
  const repo = await getRepository(UserVerificationToken)
  const now = getUTCNow()
  const expired = await repo.find({
    where: {
      expires: LessThan(now),
    },
    select: ['id'],
  })

  if (!expired?.length) return
  const ids = expired.map((u) => u.id)

  return await repo.delete(ids)
}

export async function deleteVerificationToken(email: string) {
  const repo = await getRepository(UserVerificationToken)
  const token = await findVerificationToken(email)
  return await repo.delete(token)
}
