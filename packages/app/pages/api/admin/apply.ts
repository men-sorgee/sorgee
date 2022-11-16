import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { getAdminClient, User } from "lib/services/directus";

async function Apply(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = getSession(req, res);
  const { user } = session!;
  if (!user || !req.body) {
    res.status(400).json({ message: "No user details provided" });
    return;
  }

  const adminClient = await getAdminClient();
  const existingUserQuery = await adminClient.items("users").readByQuery({
    filter: { email: user.email },
  });

  const userDetails = req.body as User;
  userDetails.email = user.email;

  if (userDetails?.vouched_by) {
    const vouchingUser = await adminClient
      .items("users")
      .readOne(userDetails.vouched_by as string);
    if (vouchingUser && vouchingUser.status == "active") {
      userDetails.user_type = vouchingUser.privileged ? "member" : "applicant";
    } else {
      userDetails.vouched_by = null;
    }
  }

  const existingUser = existingUserQuery?.data
    ? existingUserQuery.data[0]
    : null;

  if (existingUser) {
    await adminClient.items("users").updateOne(existingUser.id!, userDetails);
  } else {
    await adminClient.items("users").createOne(userDetails);
  }
  res.status(200).json({ message: "Success" });
}

export default withApiAuthRequired(Apply);
