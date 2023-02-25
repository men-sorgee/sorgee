import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import { findInvite, updateInvite } from 'lib/services/directus/server'
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

    const invite = (await findInvite(event_id as string, user_id as string)) as EventUser
    const event = invite.events_id as GroupEvent

    switch (method) {
      case 'GET': {
        if (!invite || event?.status !== 'scheduled') {
          return res.redirect(baseUrl + '/member/events')
        }
        await updateInvite(invite.id, { rsvp })
        return res.redirect(baseUrl + '/member/events/' + event.id)
        break
      }
      case 'POST': {
        await updateInvite(invite.id, { rsvp, reason })
        return res.status(200).json(ApiResponse({}))
        break
      }
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e))
  }
}
