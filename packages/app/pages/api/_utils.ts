import { getSession, UserProfile } from "@auth0/nextjs-auth0";
import { findMember, getMember, recordMemberLogin} from 'lib/services/directus/server'
import { getCookie, setCookie } from 'lib/services/cookies'
import { NextApiRequest, NextApiResponse } from 'next'
import { Member } from '../../lib/services/directus'

export type HttpMethod = string  & "GET" | "POST"| "PATCH" | "PUT" | "DELETE"

export function withMethods(
  req: NextApiRequest,
  allowed: HttpMethod[] = ["GET" , "POST", "PATCH", "PUT", "DELETE"] ): HttpMethod {
  const method = req.method.toUpperCase() as HttpMethod
  if (!allowed.includes(method)) {
   throw new Error("Method Not Allowed")
  }
  return method
}

export async function withUser(
  req: NextApiRequest, 
  res: NextApiResponse,
  throwError = true): Promise<UserProfile|null> {
  const session = getSession(req, res);
  const { user } = session!;
  if (user) return user;
  if (throwError)
    throw new Error("User not found")
  return null
}

export async function withMember(
  req: NextApiRequest, 
  res: NextApiResponse,
  throwError = true): Promise<Member|null> {
  const user = await withUser(req, res)
  if (user == null) return null;
  const id = getCookie(req, user.sub);
  const member = id ? await getMember(id) : await findMember(user.email);
  if (member) {
     if (!id) {
      recordMemberLogin(member.id);
      setCookie(res, user.sub, member.id)
    }
    return member;
  }
  if (throwError)
    throw new Error("Member not found")
  return null
}