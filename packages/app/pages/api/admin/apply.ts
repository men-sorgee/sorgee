import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUser, updateUser } from 'lib/services/directus/server';
import { parseInvite, withAppUser, withUser } from 'lib/services/api';
import { ApiResponse } from 'lib/types';
import {
  addSubscriber,
  sendApplicationWorkflowEmail
} from 'lib/services/sendgrid/server';
import { Applicant, getApplicationStatusIndex } from 'lib/services/directus';

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const user = await withUser(req, res);
    const existingUser = await withAppUser(req, res, false);

    let newUser =
      !existingUser ||
      getApplicationStatusIndex(existingUser.application_status) == 0;

    const userDetails = req.body as Applicant;

    if (newUser) {
      if (userDetails?.invite) {
        const { v: vid, t: user_type } = parseInvite(userDetails.invite);
        const vouchingUser = await getUser(vid);
        if (vouchingUser?.status === 'active') {
          userDetails.vouched_by = vid;
          if (vouchingUser.user_type == 'staff') {
            userDetails.user_type = user_type;
          }
        }
        delete userDetails.invite;
      }
      await addSubscriber(
        userDetails.first_name,
        userDetails.last_name,
        userDetails.email
      );
      await sendApplicationWorkflowEmail(
        userDetails.email,
        `Application Status`,
        'Your membership application has begun!',
        'Complete Application',
        'https://guysnheat.com/apply'
      );
      userDetails.in_sendgrid = true;
      userDetails.email = user.email;
      userDetails.application_status = 'verify';
    }

    await (existingUser
      ? updateUser(existingUser.id!, userDetails)
      : createUser(userDetails));
  } catch (e: any) {
    console.error(e);
    res.status(400).json(ApiResponse(null, e.message || e));
  }
  res.status(200).end();
}

export default withApiAuthRequired(Apply);
