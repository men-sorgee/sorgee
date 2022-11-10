import { withApiAuthRequired, getSession, Session } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

// Serverless function
// Protected API, requests to '/api/me' without a valid session cookie will fail

function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { user } = getSession(req, res) as Session;
    if (user)
      res.status(200).json({
        session: "true",
        id: user.sub,
        nickname: user.nickname,
      });
    else res.status(401);
  } catch (e) {
    res.status(500).json({ error: "Unable to fetch", description: e });
  }
}

export default withApiAuthRequired(handler);
