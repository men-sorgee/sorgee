import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from 'lib/types';
import { withMethods } from 'lib/services/api';
import { sendApplicationWorkflowEmail } from 'lib/services/sendgrid/server';

async function SendNotification(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

    if (req.query.token !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'));

    const { email, subject, message, buttonText, buttonLink } = req.body;

    await sendApplicationWorkflowEmail(
      email,
      subject,
      message,
      buttonText,
      buttonLink
    );

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}

export default SendNotification;
