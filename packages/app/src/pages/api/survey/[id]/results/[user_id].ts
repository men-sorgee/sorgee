import { UserSurvey } from "lib/models";
import { getUserSurveyAnswers } from "lib/services/directus/server";
import { ApiResponse, withMember } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function UserSurvey(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserSurvey>>
) {
  try {
    await withMember(req, res)

    const { id: i, user_id } = req.query
    const id = String(i)
    const userId = String(user_id)

    const userSurvey = await getUserSurveyAnswers(id, userId)

    return res.status(200).json(ApiResponse(userSurvey))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, 'Unauthorized'))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
