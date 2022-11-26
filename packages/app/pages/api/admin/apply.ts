import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUser, updateUser } from 'lib/services/directus/server'
import { withAppUser, withUser } from '../_utils'

import { ApiResponse } from '../../../lib/types'
import { addSubscriber, sendApplicationWorkflowEmail } from '../../../lib/services/sendgrid/server'
import { Applicant } from '../../../lib/services/directus'

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  
  try {
    const user = await withUser(req, res);
    const existingUser = await withAppUser(req, res, false);

    const userDetails = req.body as Applicant;
    userDetails.email = existingUser?.email || user.email;
    userDetails.application_status = "verify";



    if (userDetails?.invite && existingUser == null) {
      const inviteJson = Buffer.from(userDetails.invite, "base64").toString(
        "utf-8"
      );
      const invite = JSON.parse(inviteJson);
      const { v: vid, t: user_type } = invite;
      const vouchingUser = await getUser(vid)
      if (vouchingUser?.status !== "active") {
        userDetails.vouched_by = vid;
        if (vouchingUser?.user_type == 'staff') {
          userDetails.user_type = user_type;
          userDetails.application_status = user_type == "brother"?  
            "agreement": "verify";
        }
      }
      delete userDetails.invite;
    }

    
    await addSubscriber(userDetails.first_name, userDetails.email)
    await (existingUser
      ? updateUser(existingUser.id!, { ...userDetails, in_sendgrid: true })
      : createUser({ ...userDetails, in_sendgrid: true })
    )

    sendApplicationWorkflowEmail(
      userDetails.email, 
      `Application Status`, 
      'Your membership application has started.',
      'Complete Application',
      'https://guysnheat.com/apply')

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(400).json({ error: { message: e?.message || e }});
  }
}

export default withApiAuthRequired(Apply);
