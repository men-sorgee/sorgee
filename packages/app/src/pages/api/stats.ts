import { ApiResponse } from 'lib/models'
import { getUserStats, MemberStats } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Stats(
  _req: NextApiRequest,
  res: NextApiResponse<ApiResponse<MemberStats>>
) {
  const { start = '022-09-01T12:30:00.000-07:00' } = _req.query
  const stats = await getUserStats(String(start))
  res.status(200).json(ApiResponse(stats))
}
