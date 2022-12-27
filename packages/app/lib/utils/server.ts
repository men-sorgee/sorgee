import { NextApiRequest, NextApiResponse } from 'next';
import { Profile, Applicant, Member } from 'lib/models';
import { getApplicant, getMember } from 'lib/services/directus/server';
import { getSession } from 'next-auth/react';

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

export async function withProfile(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Profile | null> {
  let { user } = await getSession({ req });
  if (!user) throw new Error('Unauthorized');
  return user as Profile;
}

export async function withApplicant(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Applicant | null> {
  let user = await withProfile(req, res);
  if (!user) return;
  const applicant = await getApplicant(user.id);
  return applicant as Applicant;
}

export async function withMember(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Member | null> {
  let user = await withProfile(req, res);
  if (!user) return;
  const member = await getMember(user.id);
  if (!member) return;
  return member as Member;
}
