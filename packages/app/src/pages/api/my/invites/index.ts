import { EventInvite } from "lib/models";
import { listInvites } from "lib/services/directus/server/users";
import { ApiResponse, ApiResponseType, withMember } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Invites(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<EventInvite[]>>
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
