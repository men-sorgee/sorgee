import { FieldMap } from "lib/models";
import { getFields } from "lib/services/directus/server";
import { ApiResponse, ApiResponseType, withUser } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function SiteFields(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<FieldMap>>
) {
  try {
    withUser(req, res)

    const { collection: c = 'users' } = req.query
    const collection = String(c)

    const fields = await getFields(collection)
    if (fields) {
      res.status(200).json(ApiResponse(fields))
    } else {
      res.status(404).json(ApiResponse(null, 'Not found'))
    }
  } catch (error) {
    console.error(error)
    res.status(500).json(ApiResponse(null, error.message))
  }

}
