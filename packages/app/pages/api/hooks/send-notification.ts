import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '@/lib/types'
import { withMethods } from '../_utils'
import { sendApplicationWorkflowEmail } from '../../../lib/services/sendgrid/server'


async function SendNotification(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
 
  try {
    if (!withMethods(req, ["POST"])) return

    if (req.headers['x-api-key'] !== process.env.ADMIN_TOKEN)
      return res.status(401).json({ error: { message: 'Unauthorized' } })

    const { email, subject, message, buttonText, buttonLink } = req.body

    sendApplicationWorkflowEmail(
      email,
      subject,
      message,
      buttonText,
      buttonLink)
   
    res.status(200).end();
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ 
      error: { message: e.message || e }  
    });
  }
}

export default SendNotification;
