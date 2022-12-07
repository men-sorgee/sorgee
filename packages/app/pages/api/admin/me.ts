import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Applicant, Member } from 'lib/services/directus';
import {
  listUserInvites,
  recordUserLogin,
  updateUser
} from 'lib/services/directus/server';
import { withAppUser, withMethods } from 'lib/services/api';
import { ApiResponse } from 'lib/types';
import { setCookie } from '../../../lib/services/cookies';

async function dressMember(member: Applicant) {
  let { photo, ...rest } = member;
  if (photo) photo = `/api/asset/${photo}`;
  const notifications = [];
  const invites = await listUserInvites(member.id);
  if (invites && invites.length > 0) {
    invites
      .filter((i) => i.rsvp === 'invited')
      .forEach((event) => {
        notifications.push({
          type: 'event',
          message: `You have been invited to ${event.name}`,
          link: `/member/events`
        });
      });
  }
  return {
    photo,
    notifications,
    ...rest
  };
}

function undressMember(member: Member) {
  let { photo, ...rest } = member;
  if (photo) photo = photo?.toString().split('/').pop();
  return {
    photo,
    ...rest
  };
}
async function getUserDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST']);
    const member = await withAppUser(req, res, true, async (user, member) => {
      await recordUserLogin(member.id);
      setCookie(res, user.sub, member.id);
    });
    switch (method) {
      case 'GET':
        res.status(200).json(ApiResponse(await dressMember(member)));
        break;
      case 'POST':
        const userDetails = req.body as Member;
        updateUser(member.id, undressMember(userDetails));
        res.status(200).json(ApiResponse(null));
        break;
      default:
        return;
    }
  } catch (e) {
    res.status(403).json(ApiResponse(null, e.message || e));
  }
}

export default withApiAuthRequired(getUserDetails);
