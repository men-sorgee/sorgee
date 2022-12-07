import { getSession, UserProfile } from '@auth0/nextjs-auth0';
import {
  findUser,
  getMember,
  getUser,
  importFile,
  updateUser,
  UploadFolder
} from 'lib/services/directus/server';
import { getCookie } from 'lib/services/cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { Applicant, Member, UserInvite } from './directus';
import { User } from './directus/types';
import { IncomingMessage, OutgoingMessage } from 'http';

export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export function parseInvite(invite: string): UserInvite {
  const inviteJson = Buffer.from(invite, 'base64').toString('utf-8');
  return JSON.parse(inviteJson);
}

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

export async function withUser(
  req: NextApiRequest,
  res: NextApiResponse,
  throwError = true
): Promise<UserProfile | null> {
  const session = getSession(req, res);
  if (!session) {
    return null;
  }
  const { user } = session!;
  if (user) return user;
  if (throwError) throw new Error('User not found');
  return null;
}

export async function withAppUser(
  req: NextApiRequest | IncomingMessage | any,
  res: NextApiResponse | OutgoingMessage | any,
  throwError = true,
  onLogin?: (user: UserProfile, member: Member) => Promise<void>
): Promise<Applicant | Member | null> {
  const user = await withUser(req, res);
  if (user == null) return null;
  const id = getCookie(req, user.sub);
  const userData = id ? await getMember(id) : await findUser<User>(user.email);
  if (userData) {
    // set cookie if not set & record login
    if (!id && onLogin) await onLogin(user, userData as any);

    // update picture id empty
    if (!userData.picture && user.picture != null) {
      const file = await importFile(
        user.picture,
        UploadFolder.members,
        userData.email
      );
      if (file) {
        await updateUser(userData.id, { picture: file.id });
      }
    }
    if (userData.application_status == 'approved') return userData as any;
    return userData as Applicant;
  }
  if (throwError) throw new Error('Member not found');
  return null;
}
