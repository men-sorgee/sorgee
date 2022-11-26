import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { Applicant, Member } from 'lib/services/directus'
import { updateUser } from 'lib/services/directus/server'
import { withAppUser, withMethods } from '../_utils'

async function getUserDetails(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const method = withMethods(req, ["GET", "POST"])
    const member = await withAppUser(req, res);
    switch (method) {
      case "GET":
        res.status(200).json(member);
        break;
      case "POST":
        const userDetails = req.body as Member
        updateUser(member.id, userDetails)
        res.status(200).end();
        break;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

export default withApiAuthRequired(getUserDetails);
