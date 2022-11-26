import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { withMember } from '../_utils'

async function getUserDetails(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const member = await withMember(req, res);
    res.status(200).json(member);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

export default withApiAuthRequired(getUserDetails);
