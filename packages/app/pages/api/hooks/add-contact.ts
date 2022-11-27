import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '@/lib/types'
import { withMethods } from '../_utils'
import { addSubscriber, sendApplicationWorkflowEmail } from 'lib/services/sendgrid/server'


async function AddContact(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
 
  try {
    if (!withMethods(req, ["POST"])) return

    if (req.headers['x-api-key'] !== process.env.ADMIN_TOKEN)
      return res.status(401).json({ error: { message: 'Unauthorized' } })

    const { email, first_name, last_name } = req.body

    addSubscriber(
      first_name,
      last_name,
      email)
   
    res.status(200).end();
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ 
      error: { message: e.message || e }  
    });
  }
}

export default AddContact;
