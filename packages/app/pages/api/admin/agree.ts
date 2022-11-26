import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { updateUser } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { AgreementData, ApiResponse } from '@/lib/types'
import { withAppUser, withMethods } from '../_utils'

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
 
  try {
    if (!withMethods(req, ["POST"])) return

    const {agree} = req.body as AgreementData
    const applicant = await withAppUser(req, res)

    if (applicant && applicant.application_status == 'agreement' && agree) {
      await updateUser(applicant.id, {
        application_status: 'approved'
      })
      res.status(200).end();
    }

    res.status(401).json({ 
      error: { message: 'You must agree as a registered user.' }  
    });
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ 
      error: { message: e.message || e }  
    });
  }
}



export default withApiAuthRequired(Agree);
