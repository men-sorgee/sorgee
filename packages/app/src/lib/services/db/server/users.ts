
import { addHours } from "date-fns";
import { getUTCNow } from "lib/utils";
import { LessThan, MoreThan } from "typeorm";

import {
  User,
  UserAccount,
  UserSession,
  UserVerificationToken
} from "../entities";
import { getRepository } from "./data-source";

export async function createUser(userData: Partial<User>) {
  const repo = await getRepository(User)
  return await repo.save(userData)
}

export async function findUser(email: string): Promise<User> {
  const repo = await getRepository(User)
  return await repo.findOne({
    where: {
      email,
    }
  })
}

export async function findUserId(email: string): Promise<string | null> {
  const repo = await getRepository(User)
  let result = await repo.findOne({
    where: {
      email,
    },
    select: ['id'],
  })
  return result?.id || null
}

export async function getUser(id: string) {
  const repo = await getRepository(User)
  return await repo.findOne({
    where: {
      id,
    },
  })
}

export async function updateUser(id: string, userData: Partial<User>) {
  const repo = await getRepository(User)
  await repo.update({ id }, userData)
  return await getUser(id)
}

export async function recordUserLogin(id: string) {
  const now = getUTCNow()
  return await updateUser(id,
    {
      presence: 'online',
      lastLogin: now,
      sessionExpire: addHours(now, 3),
    }
  )
}

export async function recordUserLogout(id: string) {
  return await updateUser(id,
    {
      presence: 'offline'
    }
  )
}


export async function expireSessions() {
  const repo = await getRepository<User>(User)
  const now = getUTCNow()
  const expired = await repo.find({
    select: ['id'],
    where: {
      sessionExpire: LessThan(now),
      presence: 'online',
    },
  })

  if (expired.length == 0) return

  const ids = expired.map((u) => u.id)

  return await repo.update(ids, {
    presence: 'offline',
    sessionExpire: null,
  })
}

export async function findUserByAccount(
  provider: string,
  providerId: string
): Promise<User | null> {
  const repo = await getRepository(UserAccount)
  const account = await repo.findOne({
    where: {
      provider,
      providerId,
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
  return await repo.save(session)
}

export async function findSession(sessionToken: string): Promise<UserSession> {
  const repo = await getRepository(UserSession)
  const session = await repo.findOne({
    where: {
      sessionToken,
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

export async function deleteSession(sessionToken: string) {
  const repo = await getRepository(UserSession)
  const session = await findSession(sessionToken)
  if (!session) return

  const { id: userId } = session.user as User
  await repo.delete(session.id)

  await updateUser(userId,
    {
      presence: 'offline',
      sessionExpire: null,
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
  return await repo.save(verificationToken)
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
