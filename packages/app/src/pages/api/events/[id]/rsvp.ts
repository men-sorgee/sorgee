import { EventInvite } from "lib/models";
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

    const { id, rsvp, reason, paid_at: p } = { ...req.query, ...req.body } as any
    const eventId = String(id)
    const paid_at = p ? String(p) : undefined
    const event = await getEvent(eventId)

    if (!event || !['planned', 'scheduled'].includes(event.status))
      throw new Error('Event not found')

    let eventUser = await findInvite(eventId, member.id)

    if (method == 'POST') {
      if (!rsvp) throw new Error('Missing rsvp')
      if (eventUser) {
        eventUser = await updateInvite(eventUser.id, { rsvp, reason, paid_at })
        if (!eventUser) throw new Error('Error updating registration')
      } else {
        if (event.invite_only && member.user_type != 'staff')
          throw new Error('Invite not found')
        eventUser = await registerForEvent(eventId, member.id, rsvp, paid_at)
        if (!eventUser) throw new Error('Error registering for event')
      }


    } else if (method == 'GET') {
      if (!eventUser && event.invite_only && member.user_type != 'staff')
        throw new Error('Invite not found')
    }

    let invite = {
      member,
      event,
      rsvp: rsvp || eventUser?.rsvp || 'not_invited',
      reason: reason || eventUser?.reason || '',
      ...eventUser
    }
    return res.status(200).json(ApiResponse<EventInvite>(invite))

  } catch (e) {
    console.error(e)
    return res.status(400).json(ApiResponse(null, e))
  }
}
