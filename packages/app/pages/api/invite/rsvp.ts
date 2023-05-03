import { NextApiRequest, NextApiResponse } from 'next'
import { baseUrl } from 'lib/config'
import { findInvite, getEvent, registerForEvent, updateInvite } from 'lib/services/directus/server'
import { withMethods } from 'lib/utils/server'
import { EventUser } from 'lib/models'
import { getServerSession } from 'next-auth'
import { authOptions } from 'lib/auth/config'

export default async function inviteRSVP(req: NextApiRequest, res: NextApiResponse) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const { event_id, user_id, rsvp, reason } = (method == 'GET' ? req.query : req.body) as any
    if (!event_id || !user_id || !rsvp) return res.redirect(baseUrl + '/events')

    const event = await getEvent(event_id as string)

    if (!event || event.status !== 'scheduled') return res.redirect(baseUrl + '/events')

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

    const url = success ? '/events/' + event_id : '/events'
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.redirect(baseUrl + '/api/auth/signin?callbackUrl=' + url)
    } else {
      return res.redirect(baseUrl + url)
    }
  } catch (e) {
    console.error(e)
    res.redirect(baseUrl + '/events')
  } finally {
    res.end()
  }
}
