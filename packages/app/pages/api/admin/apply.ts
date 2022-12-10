import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUser, updateUser } from 'lib/services/directus/server';
import { ApiResponse } from 'models';
import {
  updateSendGrid,
  sendApplicationWorkflowEmail
} from 'lib/services/sendgrid/server';
import { Applicant, ApplicationStatus, MemberLevel } from 'models';
import { User } from 'lib/services/directus/types';
import { withApplicant } from 'lib/utils/server';
import { parseInvite } from '../../apply/[invite]';

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const existingUser = await withApplicant(req, res);

    let newUser =
      !existingUser || ApplicationStatus[existingUser.application_status] == 0;

    const userDetails = req.body as Applicant;

    if (newUser) {
      if (userDetails?.invite) {
        const { v: vid, t: user_type } = parseInvite(userDetails.invite);
        const vouchingUser = await getUser(vid);
        if (vouchingUser?.status === 'active') {
          userDetails.vouched_by = vid;
          if (vouchingUser.user_type == 'staff') {
            userDetails.user_type = user_type as string;
          }
        }
        delete userDetails.invite;
      }

      await sendApplicationWorkflowEmail(
        userDetails.email,
        `Application Status`,
        'Your membership application has begun!',
        'Complete Application',
        'https://guysnheat.com/apply'
      );
      userDetails.in_sendgrid = true;
      userDetails.email = existingUser.email;
      userDetails.application_status = 'verify';
    }

    const applicant = await (existingUser
      ? updateUser(existingUser.id!, userDetails as User)
      : createUser(userDetails as User));

    await updateSendGrid(
      userDetails.first_name,
      userDetails.last_name,
      userDetails.email,
      applicant.id,
      MemberLevel[userDetails.user_type]
    );
  } catch (e: any) {
    console.error(e);
    res.status(400).json(ApiResponse(null, e.message || e));
  }

  res.status(200).end();
}

export default withApiAuthRequired(Apply);
