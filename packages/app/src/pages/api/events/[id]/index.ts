import { EventDetail, EventUser, Member, MemberLevel } from "lib/models";
import { getEventDetail } from "lib/services/directus/server";
import { ApiResponse, withMember, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Event(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventDetail | EventUser[]>>
) {
  try {
    withMethods(req, ['GET'])
    const user = await withMember(req, res)
    const { id: i } = req.query
    if (!i || i == 'undefined') throw new Error('Missing event id')

    const id = String(i)

    const event = await getEventDetail(id)
    if (!event) throw new Error('Event not found')

    const level = MemberLevel[user.user_type]

    if (level < MemberLevel.staff) {
      delete event.stats.paid_count
      delete event.stats.invited_count
      delete event.stats.attended_count
      event.attendance.forEach((a: EventUser) => {
        let user = a.users_id as Member
        delete user.email
      })
    }

    return res.status(200).json(ApiResponse(event))

  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}


