import { baseUrl } from 'lib/config'
import {
  ApiResponse,
  Applicant,
} from 'lib/models'
import {
  findInvite,
  getEvent,
} from 'lib/services/directus/server'
import {
  withMethods,
  withStaff,
} from 'lib/utils/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function InviteCheckIn(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    withMethods(req, ['GET'])
    await withStaff(req, res)
    const { event_id, user_id } = req.query
    const event = await getEvent(event_id as string)
    if (!event) {
      return res.redirect(baseUrl + '/404')
    }

    const invite = await findInvite(event_id as string, user_id as string)
    if (!invite) {
      return res.redirect(
        baseUrl + `/admin/event/${event_id}?error=No+invite+found&user_id=${user_id}`
      )
    }

    return res.redirect(baseUrl + '/admin/event/invite/' + invite.id)
  } catch (e) {
    console.error(e)
    return res.redirect(baseUrl + '/500')
  }
}
