import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { updateUser, uploadFile, UploadFolder } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, InviteLink } from '@/lib/types'
import { withAppUser, withMethods } from '../_utils'
import { sendApplicationWorkflowEmail } from '../../../lib/services/sendgrid/server'

async function Invite(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
 
  try {
    if (!withMethods(req, ["POST"])) return

    const member = await withAppUser(req, res)
    const { email, link } = req.body as InviteLink

    await sendApplicationWorkflowEmail(
      email, 
     `${member.first_name} ${member.last_name} has invited you to join our community!`,
      `Begin your application, by clicking the button below.`,
      `Accept Invitation`,
      link)
   
    res.status(200).end();
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ 
      error: { message: e.message || e }  
    });
  }
}

export default withApiAuthRequired(Invite);
