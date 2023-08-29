import { Member, MemberAlert } from "lib/models";
import { addAlert, getUser } from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function MemberAlerts(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<MemberAlert> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['POST'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getUser<Member>(user_id)
    if (them == null) {
      res.status(404).json(ApiResponse(null, 'Not Found'))
    }

    switch (method) {
      case 'POST': {
        const { message, button_url, button_text } = req.body
        const notification = addAlert(user_id, {
          message,
          button_url,
          button_text,
        })
        return res.status(200).json(ApiResponse(notification))
      }

    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
