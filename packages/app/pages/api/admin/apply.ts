import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { createMember, getMember, updateMember } from 'lib/services/directus/server'
import { withMember, withUser } from '../_utils'
import { Member } from 'lib/services/directus'
import { ApiResponse } from '../../../lib/types'

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  
  try {
    const user = await withUser(req, res);
    const existingUser = await withMember(req, res, false);

    const userDetails = req.body as Member;
    userDetails.email = existingUser?.email || user.email;
    userDetails.application_status = existingUser?.photo ? "review" : "verify";

    if (userDetails?.invite && existingUser == null) {
      const inviteJson = Buffer.from(userDetails.invite, "base64").toString(
        "utf-8"
      );
      const invite = JSON.parse(inviteJson);
      const { v: vid, t: user_type } = invite;
      const vouchingUser = await getMember(vid)
      if (vouchingUser?.status !== "active") {
        userDetails.vouched_by = vid;
        if (vouchingUser?.privileged) {
          userDetails.user_type = user_type;
          userDetails.application_status = user_type == "brother"?  
            "agreement": "verify";
        }
      }
      delete userDetails.invite;
    }

    await (existingUser
      ? updateMember(existingUser.id!, userDetails)
      : createMember(userDetails)
    )

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(400).json({ error: { message: e?.message || e }});
  }
}

export default withApiAuthRequired(Apply);
