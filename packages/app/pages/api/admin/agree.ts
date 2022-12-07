import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { updateUser } from 'lib/services/directus/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { AgreementData, ApiResponse } from 'lib/types';
import { withAppUser, withMethods } from 'lib/services/api';
import {
  sendApplicationWorkflowEmail,
  updateSendGrid
} from 'lib/services/sendgrid/server';
import { ApplicationStatus, MemberLevel } from '../../../lib/services/directus';

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST']))
      return res.status(401).json(ApiResponse(null, 'Unauthorized'));

    const { agree } = req.body as AgreementData;
    const applicant = await withAppUser(req, res);

    if (applicant.application_status == 'approved')
      return res.status(200).end();

    if (applicant && applicant.application_status == 'agreement' && agree) {
      const status = ApplicationStatus[applicant.application_status];
      if (status == 3)
        sendApplicationWorkflowEmail(
          applicant.email,
          `Application Status`,
          `Your free membership is now active!`,
          'Manage Profile',
          'https://guysnheat.com/member/account'
        );

      await updateUser(applicant.id, {
        application_status: ApplicationStatus[ApplicationStatus.approved],
        user_type: MemberLevel[MemberLevel.member]
      });

      await updateSendGrid(
        applicant.first_name,
        applicant.last_name,
        applicant.email,
        applicant.id,
        MemberLevel.member
      );

      return res.status(200).end();
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e?.message || e));
  }
}

export default withApiAuthRequired(Agree);
