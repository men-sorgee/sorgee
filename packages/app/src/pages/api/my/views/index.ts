import { UserViews } from "lib/models";
import { getUserViews } from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponseType<UserViews> | ApiResponseType>) {
  try {
    withMethods(req, ['GET'])
    const user = await withMember(req, res)

    const views = await getUserViews(user.id)

    if (user.has_features.includes('my_views') || user.user_type == 'staff') {
      return res.status(200).json(ApiResponse(views))
    } else {
      delete views.users
      return res.status(200).json(ApiResponse(views))
    }

  } catch (error) {
    console.error(error)
    return res.status(500).json(ApiResponse(error))
  }
}
