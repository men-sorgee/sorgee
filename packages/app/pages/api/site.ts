import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Site } from 'lib/models'

export default async function getSite(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Site>>
) {
  const url = `${process.env.ADMIN_URL}/items/site`
  const response = await fetch(url)
  const data: { data: Site } = await response.json()
  res.status(response.status).json(ApiResponse(data.data))
}
