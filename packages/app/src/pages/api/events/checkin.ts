import { baseUrl } from 'lib/config'
import { ApiResponse, Applicant, EventUser } from 'lib/models'
import { findInvite, findUser, getEvent, registerForEvent } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'

import { withMethods, withStaff } from '../../../lib/utils/server'

export default async function EventCheckIn(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  const { event_id: e, user_id: u, email: m } = req.query
  const event_id = e as string
  try {
    withMethods(req, ['GET'])
    await withStaff(req, res)
    let user_id = u as string
    const email = m as string
    if (!user_id && email) {
      const user = await findUser(email)
      if (!user)
        return res.redirect(
          baseUrl + '/admin/event/' + event_id + '?error=No user found with that email address'
        )
      if (user) user_id = user.id
    }
    const event = await getEvent(event_id as string)
    if (!event || event.status !== 'scheduled') return res.redirect(baseUrl + '/events')

    let invite = (await findInvite(event_id, user_id as string)) as EventUser

    if (!invite) {
      invite = await registerForEvent(event_id, user_id, 'not_invited')
    }

    return res.redirect(baseUrl + '/admin/event/invite/' + invite.id)
  } catch (e) {
    console.error(e)
    return res.redirect(baseUrl + '/admin/event/' + event_id + `?error=${e.message}`)
  }
}
