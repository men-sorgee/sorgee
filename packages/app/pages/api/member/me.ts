import { NextApiRequest, NextApiResponse } from 'next';
import { deleteNotification, updateUser } from 'lib/services/directus/server';
import { withMember, withMethods } from 'lib/utils/server';
import { User, Applicant, Member, ApiResponse } from 'lib/models';

function dressMember(member: Applicant) {
  let { photo, ...rest } = member;
  if (photo) photo = `/api/asset/${photo}`;
  return {
    photo,
    ...rest
  };
}

function undressMember(member: Member): Partial<User> {
  let { photo, ...rest } = member;
  if (photo) photo = photo?.toString().split('/').pop();
  delete rest.notifications;
  return {
    photo,
    ...rest
  } as any;
}

export default async function getUserDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST', 'DELETE']);
    const member = await withMember(req, res);
    switch (method) {
      case 'DELETE':
        const id = req.body.id;
        await deleteNotification(id);
        return res.status(200).end();

      case 'GET':
        return res.status(200).json(ApiResponse(dressMember(member)));

      case 'POST':
        const userDetails = req.body as Member;
        updateUser(member.id, undressMember(userDetails));
        return res.status(200).json(ApiResponse(null));

      default:
        return res.status(200).end();
    }
  } catch (e) {
    res.status(200).json(ApiResponse(null, e.message || e));
  }
}

//export default withApiAuthRequired(getUserDetails);
