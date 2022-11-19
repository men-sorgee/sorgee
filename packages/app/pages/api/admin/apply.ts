import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { getAdminClient, FormUser, userFields } from "lib/services/directus";

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
    fields: [...(userFields as any)],
  });

  try {
    let userDetails = req.body;
    userDetails.email = user.email;

    if (userDetails?.invite) {
      const inviteJson = Buffer.from(userDetails.invite, "base64").toString(
        "utf-8"
      );
      const invite = JSON.parse(inviteJson);
      const { v: vid, t: user_type } = invite;
      const vouchingUser: any = await users.readOne(vid, {
        fields: ["id", "privileged", "status"],
      });
      if (vouchingUser?.status !== "active") {
        userDetails.vouched_by = vid;
        userDetails.user_type = vouchingUser?.privileged ? user_type : "pledge";
      }
      delete userDetails.invite;
    }

    const existingUser: any = existingUserQuery?.data
      ? existingUserQuery.data[0]
      : null;

    userDetails.status = existingUser?.status || "new";

    await (existingUser
      ? users.updateOne(existingUser.id!, userDetails, {
          fields: [...(userFields as any)],
        })
      : users.createOne(userDetails)
    )
      .then(
        () => res.status(200).end(),
        (err) => {
          console.error(err);
          res.status(500).json(err);
        }
      )
      .catch((err) => console.error(err));
  } catch (e: any) {
    res.status(400).json({ message: e?.message || e });
  }
}

export default withApiAuthRequired(Apply);
