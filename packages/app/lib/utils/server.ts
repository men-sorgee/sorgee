import { HttpMethod } from '.'
import { NextApiRequest, NextApiResponse } from 'next'
import { Applicant, Member, UserInvite, applicantFields, memberFields } from 'lib/models'

import { findUser } from 'lib/services/directus/server'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { User } from 'next-auth'

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
): Promise<User | null> {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) throw new Error('Unauthorized')
  return session.user as User
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

export async function withMember(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Member | null> {
  let user = await withAuthUser(req, res)
  if (!user) throw new Error('Unauthorized')
  const member = await findUser<Member>(user.email, memberFields)
  return member
}

export function parseInvite(invite: string): UserInvite {
  const inviteJson = Buffer.from(invite, 'base64').toString('utf-8')
  return JSON.parse(inviteJson)
}
