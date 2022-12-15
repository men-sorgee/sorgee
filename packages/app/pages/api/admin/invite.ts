import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, InviteLink } from 'models';
import { withMember, withMethods } from 'lib/utils/server';
import { sendNotificationEmail } from 'lib/services/sendgrid/server';

async function Invite(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return;

    const member = await withMember(req, res);
    const { email, link } = req.body as InviteLink;

    await sendNotificationEmail(
      email,
      `${member.first_name} ${member.last_name} has invited you to join our community!`,
      `Begin your application, by clicking the button below.`,
      `Accept Invitation`,
      link
    );

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}

export default withApiAuthRequired(Invite);
