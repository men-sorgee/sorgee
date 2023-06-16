import { adminBaseUrl } from 'lib/config'
import { ApiResponse, Site } from 'lib/models'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Site(req: NextApiRequest, res: NextApiResponse<ApiResponse<Site>>) {
  const url = `${adminBaseUrl}/items/site`

  const response = await fetch(url)
  const data: { data: Site } = await response.json()
  res.status(response.status).json(ApiResponse(data.data))
}
