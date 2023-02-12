import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from 'lib/models'
import { getUserStats } from 'lib/services/directus/server'

export default async function getSite(_req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const stats = await getUserStats()
  res.status(200).json(ApiResponse(stats))
}
