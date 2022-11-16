import { withApiAuthRequired, getSession, Session } from "@auth0/nextjs-auth0";

import { getAdminClient } from "lib/services/directus/client";
import { NextApiRequest, NextApiResponse } from "next";

async function getUserDetails(req: NextApiRequest, res: NextApiResponse<any>) {
  const adminClient = await getAdminClient();
  const session = getSession(req, res) as Session;

  const { user } = session;
  if (user?.email) {
    const results = await adminClient
      .items("users")
      .readByQuery({ filter: { email: { _eq: user.email } } });

    if (results.data) {
      res.status(200).json(Object.assign({}, user, results.data || {}));
      return;
    }

    try {
      const { nickname, name, email, email_verified, picture } = user;
      const result = await adminClient.items("users").createOne({
        nickname,
        first_name: name,
        email,
        email_verified,
        photo: picture,
      });

      if (result?.id) {
        res.status(200).json(Object.assign({}, user, result));
        return;
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  res.status(403).json({ error: "There was a problem" });
}

export default withApiAuthRequired(getUserDetails);
