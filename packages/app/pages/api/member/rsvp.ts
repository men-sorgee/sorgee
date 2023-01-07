import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import { updateEventUserRSVP } from 'lib/services/directus/server'
import { withMethods } from 'lib/utils/server'
import { ApiResponse, Applicant } from 'lib/models'

export default async function inviteRSVP(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])

    switch (method) {
      case 'GET': {
        const { event_id, user_id, rsvp } = req.query
        await updateEventUserRSVP(event_id as string, user_id as string, rsvp as any, null)
        break
      }
      case 'POST': {
        const { event_id, user_id, rsvp, reason } = req.body
        await updateEventUserRSVP(event_id, user_id, rsvp, reason)
        break
      }
    }

    return res.redirect(baseUrl + '/member/events')
  } catch (e) {
    console.error(e)
    return res.redirect(baseUrl + '/member/events')
  }
}
