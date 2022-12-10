import {
  AfterCallback,
  AfterRefetch,
  handleAuth,
  handleCallback,
  handleProfile,
  Session
} from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Profile } from 'models';
import { findUser, recordUserLogin } from 'lib/services/directus/server';
import { updateSendGrid } from 'lib/services/sendgrid/server';
import { MemberLevel } from 'models';
import { memberCookie } from 'config/client';
import { setCookie } from 'cookies-next';
type MemberSession = Session & { user: Profile };

async function withMember(session: Session): Promise<MemberSession> {
  try {
    const {
      user: { email, sub }
    } = session;
    const user = await findUser<Profile>(email);
    if (!user) return session as MemberSession;
    session.user = { sub, ...user };
  } catch (error) {
    console.error(error);
  }
  return session as MemberSession;
}

async function loginMember(session: Session) {
  try {
    const {
      user: { id, first_name, last_name, email, user_type }
    } = session as MemberSession;

    await recordUserLogin(id);
    await updateSendGrid(
      first_name,
      last_name,
      email,
      id,
      MemberLevel[user_type]
    );
  } catch (error) {
    console.error(error);
  }
}

const afterRefetch: AfterRefetch = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  session = await withMember(session);
  setCookie(memberCookie, session.user.id, { req, res, maxAge: 60 * 60 * 12 });
  return session;
};

const afterCallback: AfterCallback = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  session = await withMember(session);
  await loginMember(session);
  setCookie(memberCookie, session.user.id, { req, res, maxAge: 60 * 60 * 12 });
  return session;
};

export default handleAuth({
  callback: async (req, res) => {
    await handleCallback(req, res, {
      afterCallback
    });
  },
  profile: async (req, res) => {
    await handleProfile(req, res, {
      afterRefetch
    });
  }
});
