import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import { findInvite, updateInvite } from 'lib/services/directus/server'
import { withMethods } from 'lib/utils/server'
import { ApiResponse, Applicant, EventUser, Event } from 'lib/models'

export default async function inviteRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const { event_id, user_id, rsvp, reason } = (method == 'GET' ? req.query : req.body) as any
    if (!event_id || !user_id || !rsvp) {
      return res.redirect(baseUrl + '/404')
    }

    const invite = (await findInvite(event_id as string, user_id as string)) as EventUser
    const event = invite.events_id as Event
    if (!invite || event?.status !== 'scheduled') {
      return res.redirect(baseUrl + '/member/events')
    }
    switch (method) {
      case 'GET': {
        await updateInvite(invite.id, { rsvp })
        break
      }
      case 'POST': {
        await updateInvite(invite.id, { rsvp, reason })
        break
      }
    }
  } catch (e) {
    console.error(e)
  }
  return res.redirect(baseUrl + '/member/events')
}
