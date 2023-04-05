// TODO: merge this with events/rsvp.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import { findInvite, getEvent, registerForEvent, updateInvite } from 'lib/services/directus/server'
import { withMethods } from 'lib/utils/server'
import { ApiResponse, Applicant, EventUser, GroupEvent } from 'lib/models'

export default async function inviteRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const { event_id, user_id, rsvp, reason } = (method == 'GET' ? req.query : req.body) as any
    if (!event_id || !user_id || !rsvp) {
      if (method == 'GET') return res.redirect(baseUrl + '/404')
      else return res.status(400).json(ApiResponse(null, 'Missing event_id, user_id, or rsvp'))
    }
    const event = await getEvent(event_id as string)
    if (!event || event.status !== 'scheduled')
      return res.status(404).json(ApiResponse(null, 'Event not found'))

    const invite = (await findInvite(event_id as string, user_id as string)) as EventUser

    let success = false
    if (invite != null) {
      await updateInvite(invite.id, { rsvp, reason })
      success = true
    } else if (event.invite_only) {
      success = false
    } else {
      await registerForEvent(event_id, user_id, rsvp)
      success = true
    }

    switch (method) {
      case 'GET': {
        return res.redirect(baseUrl + '/events/' + event_id)
      }
      case 'POST': {
        return res
          .status(success ? 200 : 400)
          .json(ApiResponse({}, success ? null : 'Failed to RSVP'))
      }
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e))
  }
}
