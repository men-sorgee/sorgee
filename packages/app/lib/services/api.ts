import { getSession, UserProfile } from '@auth0/nextjs-auth0';
import {
  findUser,
  getUser,
  getMember,
  getApplicant,
  recordUserLogin,
  importFile,
  UploadFolder,
  updateUser
} from 'lib/services/directus/server';
import { getCookie, setCookie } from 'lib/services/cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { Applicant, Member } from './directus';
import { User } from './directus/types';

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

export async function withUser(
  req: NextApiRequest,
  res: NextApiResponse,
  throwError = true
): Promise<UserProfile | null> {
  const session = getSession(req, res);
  const { user } = session!;
  if (user) return user;
  if (throwError) throw new Error('User not found');
  return null;
}

export async function withAppUser(
  req: NextApiRequest,
  res: NextApiResponse,
  throwError = true
): Promise<Applicant | Member | null> {
  const user = await withUser(req, res);
  if (user == null) return null;
  const id = getCookie(req, user.sub);
  const userData = id ? await getUser(id) : await findUser<User>(user.email);
  if (userData) {
    // set cookie if not set & record login
    if (!id) {
      recordUserLogin(userData.id);
      setCookie(res, user.sub, userData.id);
    }
    // update picture id empty
    if (userData.picture == null && user.picture != null) {
      const file = await importFile(
        user.picture,
        UploadFolder.members,
        userData.email
      );
      if (file) {
        await updateUser(userData.id, { picture: file.id });
      }
    }
    if (userData.application_status == 'approved') return userData as Member;
    return userData as Applicant;
  }
  if (throwError) throw new Error('Member not found');
  return null;
}
