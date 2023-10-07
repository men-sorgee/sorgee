import { GroupEvent } from "lib/models";
import { listAdminEvents } from "lib/services/directus/server/events";
import { ApiResponse, ApiResponseType, withStaff } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<GroupEvent[]>>
) {
  try {
    await withStaff(req, res)
    const events = await listAdminEvents()

    return res.status(200).json(ApiResponse(events))
  } catch (e) {
    console.error(e)
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([], e))
    return res.status(401).json(ApiResponse([], e))
  }
}
