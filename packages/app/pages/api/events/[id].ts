import { ApiResponse, EventDetail, MemberLevel } from 'lib/models'
import { getEventDetail } from 'lib/services/directus/server'
import { withMember } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Event(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventDetail>>
) {
  try {
    const user = await withMember(req, res)
    const { id: i } = req.query
    const id = String(i)
    const event = await getEventDetail(id)

    const level = MemberLevel[user.user_type]

    if (level < MemberLevel.staff) {
      delete event.stats.paid_count
      delete event.stats.invited_count
      delete event.stats.attended_count
    }

    return res.status(200).json(ApiResponse(event))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}
