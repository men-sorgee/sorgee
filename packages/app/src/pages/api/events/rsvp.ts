import { ApiResponse, EventUser, GroupEvent, RSVPInfo } from 'lib/models'
import { findInvite, getEvent, registerForEvent, updateInvite } from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function EventRSVPHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventUser> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'GET'])
    const member = await withMember(req, res)

    const { event_id, rsvp, reason } = { ...req.query, ...req.body } as RSVPInfo

    //console.dir({ event_id, rsvp, reason })

    if (!event_id)
      throw new Error('Missing event_id or rsvp')


    const event = (await getEvent(event_id as string)) as GroupEvent
    if (!event || !['planned', 'scheduled'].includes(event.status)) {
      throw new Error('Event not found')
    }

    let invite = await findInvite(event_id as string, member.id)

    if (method == 'POST') {
      if (!rsvp) throw new Error('Missing rsvp')
      if (invite) {
        invite = await updateInvite(invite.id, { rsvp, reason })
      } else if (event.invite_only) {
        throw new Error('Invite not found')
      } else {
        invite = await registerForEvent(event_id, member.id, rsvp)
      }
    } else if (!invite) {
      throw new Error('Invite not found')
    }

    return res.status(200).json(ApiResponse(invite))
  } catch (e) {
    console.error(e)
    return res.status(200).json(ApiResponse(null, e))
  }
}
