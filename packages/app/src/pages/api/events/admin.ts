import { GroupEvent } from "lib/models";
import { listAdminEvents } from "lib/services/directus/server";
import { ApiResponse, withStaff } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GroupEvent[]>>
) {
  try {
    await withStaff(req, res)
    const events = await listAdminEvents()

    return res.status(200).json(ApiResponse(events))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, e))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
