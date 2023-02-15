import { HttpMethod } from '.'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  Applicant,
  Member,
  User,
  UserInvite,
  applicantFields,
  memberFields,
  MemberLevel,
} from 'lib/models'

import { findUser } from 'lib/services/directus/server'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { User as AuthUser } from 'next-auth'

export function withMethods(
  req: NextApiRequest,
  allowed: HttpMethod[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
): HttpMethod {
  const method = req.method.toUpperCase() as HttpMethod
  if (!allowed.includes(method)) {
    throw new Error('Method Not Allowed')
  }
  return method
}

export async function withAuthUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthUser | null> {
  const session = await unstable_getServerSession(req, res, authOptions)
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
