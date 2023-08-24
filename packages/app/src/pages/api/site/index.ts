import { adminBaseUrl } from "lib/config";
import { Site } from "lib/models";
import { ApiResponse, ApiResponseType } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Site(req: NextApiRequest, res: NextApiResponse<ApiResponseType<Site>>) {
  const url = `${adminBaseUrl}/items/site?fields=[*.*]`

  const response = await fetch(url)
  const data: { data: Site } = await response.json()
  res.status(response.status).json(ApiResponse(data.data))
}
