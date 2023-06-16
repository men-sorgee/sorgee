import {
  Applicant,
  applicantFields,
  Member,
  memberFields,
  MemberLevel,
  User,
  UserInvite,
} from 'lib/models'
import { findUser } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, User as AuthUser } from 'next-auth'

import { authOptions } from '@/lib/auth/config'

export function withMethods(
  req: NextApiRequest,
  allowed: string[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
) {
  const method = req.method.toUpperCase()
  if (method === 'OPTIONS' || method === 'HEAD') return method

  if (!allowed.includes(method)) {
    throw new Error(`Method ${method} Not Allowed. Allowed: ` + allowed.join(', '))
  }
  return method
}

export async function withAuthUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthUser | null> {
  const session = await getServerSession(req, res, authOptions)
  if (!session) throw new Error('Unauthorized')
  return session.user as AuthUser
}

export async function withApplicant(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Applicant | null> {
  let user = await withAuthUser(req, res)
  if (!user) throw new Error('Unauthorized')
  const applicant = await findUser<Applicant>(user.email, applicantFields)
  return applicant
}

export async function withUser(req: NextApiRequest, res: NextApiResponse): Promise<User | null> {
  let user = await withAuthUser(req, res)
  if (!user) throw new Error('Unauthorized')
  const userData = await findUser<User>(user.email, ['*.*'])
  return userData
}

export async function withMember(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Member | null> {
  let user = await withAuthUser(req, res)
  if (!user) throw new Error('Unauthorized')

  const member = await findUser<Member>(user.email, memberFields)
  if (
    member.status != 'active' ||
    member.application_status != 'approved' ||
    MemberLevel[member.user_type] < MemberLevel.pledge
  )
    throw new Error('Unauthorized')
  return member
}

export async function withStaff(req: NextApiRequest, res: NextApiResponse): Promise<Member | null> {
  let user = await withAuthUser(req, res)
  if (!user) throw new Error('Unauthorized')

  const member = await findUser<Member>(user.email, memberFields)
  if (
    member.status != 'active' ||
    member.application_status != 'approved' ||
    MemberLevel[member.user_type] < MemberLevel.staff
  )
    throw new Error('Unauthorized')
  return member
}

export function parseInvite(invite: string): UserInvite {
  const inviteJson = Buffer.from(invite, 'base64').toString('utf-8')
  return JSON.parse(inviteJson)
}
