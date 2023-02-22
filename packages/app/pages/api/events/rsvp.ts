import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import { findInvite, getEvent, registerForEvent, updateInvite } from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { ApiResponse, Applicant, EventUser, GroupEvent } from 'lib/models'

export default async function eventRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST'])
    const member = await withMember(req, res)
    const { event_id, rsvp, reason } = req.body as any

    if (!event_id || !rsvp) {
      if (method == 'GET') return res.redirect(baseUrl + '/404')
      else return res.status(400).json(ApiResponse(null, 'Missing event_id or rsvp'))
    }

    const event = (await getEvent(event_id as string)) as GroupEvent
    if (!event || !['planned', 'scheduled'].includes(event.status)) {
      return res.status(404).json(ApiResponse(null, 'Event not found'))
    }

    let invite = (await findInvite(event_id as string, member.id)) as EventUser
    if (invite) {
      invite = await updateInvite(invite.id, { rsvp, reason })
    } else {
      if (event.invite_only) {
        return res.status(404).json(ApiResponse(null, 'Invite not found'))
      }
      invite = await registerForEvent(event_id, member.id, rsvp)
    }
    return res.status(200).json(ApiResponse(invite))
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e))
  }
}
