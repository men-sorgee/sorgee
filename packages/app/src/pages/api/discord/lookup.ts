import { findUser } from "lib/services/directus/server";
import { Member } from "lib/models";
import { ApiResponse } from 'lib/utils'

export default async function LookupUser(req, res) {
  try {
    const { email } = req.query;
    const user = await findUser<Member>(email, ['id', 'email', 'user_type', 'status', 'membership_type', 'nickname']);

    return res.status(200).json(ApiResponse({
      id: user.id,
      email: user.email,
      role: user.user_type,
      status: user.status,
      membership: user.membership_type,
      name: user.nickname
    }));
  } catch (e) {
    console.error(e);
    return res.status(401).json(ApiResponse(null, e));
  }
}
