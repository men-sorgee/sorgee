import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { getAdminClient, User } from "lib/services/directus";
import { DirectusTypes } from "@directus/sdk";
import { NextFetchEvent } from "next/server";

async function Apply(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = getSession(req, res);
  const { user } = session!;
  if (!user || !req.body) {
    res.status(400).json({ message: "No user details provided" });
    return;
  }

  const adminClient = await getAdminClient();
  const users = adminClient.items("users");
  const existingUserQuery = await users.readByQuery({
    filter: { email: user.email },
  });

  try {
    let userDetails = req.body;
    userDetails.email = user.email;

    if (userDetails?.vouched_by) {
      const vouchingUser = await users.readOne(
        userDetails.vouched_by as string
      );
      if (vouchingUser?.status !== "active") {
        userDetails.user_type = vouchingUser?.privileged ? "member" : "pledge";
      } else {
        userDetails.vouched_by = null;
      }
    }

    const existingUser = existingUserQuery?.data
      ? existingUserQuery.data[0]
      : null;

    userDetails.status = existingUser?.status || "new";

    await (existingUser
      ? users.updateOne(existingUser.id!, userDetails, { fields: "*" })
      : users.createOne(userDetails)
    )
      .then(
        () => res.status(200).end(),
        (err) => res.status(500).json(err)
      )
      .catch((err) => console.error(err));
  } catch (e: any) {
    res.status(400).json({ message: e?.message || e });
  }
}

export default withApiAuthRequired(Apply);
