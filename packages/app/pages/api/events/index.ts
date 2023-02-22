import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, GroupEvent } from 'lib/models'
import { listUpcomingEvents } from 'lib/services/directus/server'
import { withMember } from 'lib/utils/server'

export default async function getSite(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GroupEvent[]>>
) {
  try {
    const member = await withMember(req, res)
    const events = await listUpcomingEvents(member.user_type)

    return res.status(200).json(ApiResponse(events))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
