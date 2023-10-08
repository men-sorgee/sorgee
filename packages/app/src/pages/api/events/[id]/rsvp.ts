
import { EventInvite, EventUser } from "lib/models/events";
import {
  findInvite,
  getEvent,
  registerForEvent,
  updateInvite
} from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function EventRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<EventInvite> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['POST', 'GET'])
    const member = await withMember(req, res)

    const { id } = req.query
    const eventId = String(id)
    const event = await getEvent(eventId)

    if (!event || !['planned', 'scheduled', 'occurred'].includes(event.status))
      throw new Error('Event not found')

    // console.dir({
    //   eventId: event.id,
    //   userId: member.id,
    // })
    let invite = await findInvite(eventId, member.id)

    if (method == 'POST') {
      const { rsvp = 'maybe', reason, paid_at: p } = req.body
      const update: Partial<EventUser> = { rsvp, reason }

      if (p) {
        update.paid_at = p
        update.paid = true
      }

      if (invite) {
        invite = await updateInvite(invite.id, update)
        if (!invite) throw new Error('Error updating registration')
      } else {
        if (event.invite_only && member.user_type != 'staff')
          throw new Error('Invite not found')
        const paid_at = p ? String(p) : null
        invite = await registerForEvent(eventId, member.id, rsvp, paid_at)
        if (!invite) throw new Error('Error registering for event')
      }
      return res.status(200).json(ApiResponse<EventInvite>({
        member,
        event,
        ...invite
      }))


    } else if (method == 'GET') {
      if (!invite && event.invite_only && member.user_type != 'staff')
        return res.status(200).json(ApiResponse<EventInvite>({
          member,
          event,
          amount: 0,
          guest: false,
          paid: false,
          rsvp: 'not_invited'
        }))
      return res.status(200).json(ApiResponse<EventInvite>({
        member,
        event,
        ...invite
      }))
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e))
  }
}
