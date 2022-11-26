import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { updateUser, uploadFile, UploadFolder } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '@/lib/types'
import { withAppUser, withMethods } from '../_utils'
import { sendApplicationWorkflowEmail } from '../../../lib/services/sendgrid/server'

export const config = {
  api: {
    bodyParser: false,
  }
}

async function Verify(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
 
  try {
    if (!withMethods(req, ["POST"])) return

    const member = await withAppUser(req, res)
    if (member == null) return
   
    const file = await uploadFile(
      req,
      UploadFolder.verification,
      `Verification: ${member.id.substring(0,4)}-${member.id.substring(4,8)}`)

    await updateUser(member.id, {
      photo: file.id,
      application_status: "review"
    })

    sendApplicationWorkflowEmail(
      member.email, 
      `Application Status`, 
      'Your photo ID was submitted. It may take a few days to review.',
      'Check Application Results',
      'https://guysnheat.com/apply/verify')
   
    res.status(200).end();
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ 
      error: { message: e.message || e }  
    });
  }
}



export default withApiAuthRequired(Verify);
