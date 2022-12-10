import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Profile, Applicant, Member } from 'models';
import { getApplicant, getMember } from '../services/directus/server';

export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export function withMethods(
  req: NextApiRequest,
  allowed: HttpMethod[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
): HttpMethod {
  const method = req.method.toUpperCase() as HttpMethod;
  if (!allowed.includes(method)) {
    throw new Error('Method Not Allowed');
  }
  return method;
}

export function withProfile(
  req: NextApiRequest,
  res: NextApiResponse
): Profile | null {
  let { user } = getSession(req, res);
  if (!user) return null;
  return user as Profile;
}

export async function withApplicant(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Applicant | Profile | null> {
  let user = withProfile(req, res);
  if (!user) return null;
  const applicant = await getApplicant(user.id);
  if (!applicant) return user;
  return applicant as Applicant;
}

export async function withMember(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Member | null> {
  let user = withProfile(req, res);
  if (!user) return null;
  const member = await getMember(user.id);
  if (!member) return null;
  return member as Member;
}
