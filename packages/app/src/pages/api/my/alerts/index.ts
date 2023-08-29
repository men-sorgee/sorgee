import { MemberAlert } from "lib/models";
import { getAlerts } from "lib/services/directus/server";
import { ApiResponse, ApiResponseType, withUser } from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function GetUserNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType>
) {
  try {
    const user = await withUser(req, res)
    let notifications: MemberAlert[] = await getAlerts(user.id)
    return res.status(200).json(ApiResponse(notifications))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
