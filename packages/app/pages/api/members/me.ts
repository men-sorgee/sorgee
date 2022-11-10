import { withApiAuthRequired, getSession, Session } from "@auth0/nextjs-auth0";
import { QueryOne } from "@directus/sdk";
import { User } from "lib/directus/types";
import { getDirectusClient } from "lib/services/directus-client";
import { NextApiRequest, NextApiResponse } from "next";

async function getUserDetails(req: NextApiRequest, res: NextApiResponse<any>) {
  const directus = await getDirectusClient();
  const { user } = getSession(req, res) as Session;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const query: QueryOne<User> = { filter: { email: { _eq: user.email } } };
  const results = await directus.items("users").readByQuery(query);

  if (!results) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const userDetail = results ? results.data : null;
  res.status(200).json(userDetail);
}
export default withApiAuthRequired(getUserDetails);
