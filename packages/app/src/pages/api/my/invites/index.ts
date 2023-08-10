import { EventUser } from "lib/models";
import { listInvites } from "lib/services/directus/server/users";
import { ApiResponse, withMember } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listUserInvites(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventUser[]>>
) {
  try {
    const member = await withMember(req, res)
    const events = await listInvites(member)
    return res.status(200).json(ApiResponse(events))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
