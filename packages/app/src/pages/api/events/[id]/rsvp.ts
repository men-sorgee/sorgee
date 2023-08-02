import { ApiResponse, EventInvite } from 'lib/models'
import { findInvite, getEvent, registerForEvent, updateInvite } from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function EventRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventInvite> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'GET'])
    const member = await withMember(req, res)

    const { id, rsvp, reason } = { ...req.query, ...req.body } as any
    const eventId = String(id)
    const event = await getEvent(eventId)

    if (!event || !['planned', 'scheduled'].includes(event.status))
      throw new Error('Event not found')

    let eventUser = await findInvite(eventId, member.id)

    if (method == 'POST') {
      if (!rsvp) throw new Error('Missing rsvp')
      if (eventUser) {
        eventUser = await updateInvite(eventUser.id, { rsvp, reason })
      } else {
        if (event.invite_only)
          throw new Error('Invite not found')

        eventUser = await registerForEvent(eventId, member.id, rsvp)
      }
    }

    const { attended, paid, guest } = eventUser

    let invite: EventInvite = {
      id: eventUser.id,
      member,
      event,
      attended,
      paid,
      guest,
      rsvp: rsvp || eventUser.rsvp || 'not_invited',
      reason: reason || eventUser.reason
    }

    return res.status(200).json(ApiResponse({
      ...invite,
      event,
      member,
      rsvp: invite.rsvp || 'not_invited',
      reason: invite.reason || ''
    }))
  } catch (e) {
    console.error(e)
    return res.status(200).json(ApiResponse(null, e))
  }
}
