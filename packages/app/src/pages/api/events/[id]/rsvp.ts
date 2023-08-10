import { differenceInBusinessDays } from "date-fns";
import { EventInvite } from "lib/models";
import {
  findInvite,
  getEvent,
  registerForEvent,
  updateInvite
} from "lib/services/directus/server";
import { ApiResponse, withMember, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function EventRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventInvite> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'GET'])
    const member = await withMember(req, res)

    const { id, rsvp, reason, paid_at } = { ...req.query, ...req.body } as any
    const eventId = String(id)
    const paidAt = paid_at ? String(paid_at) : undefined
    const event = await getEvent(eventId)

    if (!event || !['planned', 'scheduled'].includes(event.status))
      throw new Error('Event not found')

    let eventUser = await findInvite(eventId, member.id)

    if (method == 'POST') {
      if (!rsvp) throw new Error('Missing rsvp')
      if (eventUser) {
        eventUser = await updateInvite(eventUser.id, { rsvp, reason, paid_at: paidAt })
        if (!eventUser) throw new Error('Error updating registration')
      } else {
        if (event.invite_only)
          throw new Error('Invite not found')
        eventUser = await registerForEvent(eventId, member.id, rsvp, paidAt)
        if (!eventUser) throw new Error('Error registering for event')
      }

      const { attended, paid, guest, amount } = eventUser

      let invite: EventInvite = {
        id: eventUser.id,
        member,
        event,
        attended,
        paid: paid || paidAt ? true : false,
        guest,
        rsvp: rsvp || eventUser.rsvp || 'not_invited',
        reason: reason || eventUser.reason,
        amount
      }
      return res.status(200).json(ApiResponse({
        event,
        member,
        rsvp: invite.rsvp || 'not_invited',
        reason: invite.reason || '',
        ...invite,
      }))
    } else {
      if (eventUser) {

        const { paid, paid_at, ...props } = eventUser
        let showPaid = paid || (paid_at && differenceInBusinessDays(new Date(paid_at), new Date()) <= 1)
        let result = {
          ...props,
          paid: showPaid,
          paid_at,
          event,
          member,
        }

        return res.status(200).json(ApiResponse(result))
      } else {
        if (event.invite_only)
          throw new Error('Invite not found')

        return res.status(200).json(ApiResponse({
          event,
          member,
          rsvp: 'not_invited'
        }))
      }
    }

  } catch (e) {
    console.error(e)
    return res.status(400).json(ApiResponse(null, e))
  }
}
