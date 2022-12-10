import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from 'models';
import { withMethods } from 'lib/utils/server';
import { sendApplicationWorkflowEmail } from 'lib/services/sendgrid/server';
import { adminToken } from 'config/server';

async function SendNotification(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

    if (req.query.token !== adminToken)
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
