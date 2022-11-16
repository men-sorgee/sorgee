import { withApiAuthRequired, getSession, Session } from "@auth0/nextjs-auth0";
import { getAdminClient } from "lib/services/directus";
import { NextApiRequest, NextApiResponse } from "next";

async function getUserDetails(req: NextApiRequest, res: NextApiResponse<any>) {
  const adminClient = await getAdminClient();
  const session = getSession(req, res) as Session;

  try {
    const { user } = session;
    if (user?.email) {
      const existingUserQuery = await adminClient.items("users").readByQuery({
        filter: { email: user.email },
      });
      const existingUser = existingUserQuery?.data
        ? existingUserQuery.data[0]
        : null;

      if (existingUser) {
        res.status(200).json(existingUser);
        return;
      }
    }
    res.status(403).json({ error: "There was a problem" });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

export default withApiAuthRequired(getUserDetails);
