import {
  Applicant,
  EventUser,
  GroupEvent,
  Member,
  MemberLevel
} from "lib/models";
import {
  findInvite,
  findUser,
  getEvent,
  getUser,
  registerForEvent
} from "lib/services/directus/server";
import { ApiResponse, withMethods, withStaff } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function EventCheckIn(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  const { id: e, user_id: u, email: m } = req.query
  const event_id = e as string

  let event: GroupEvent
  try {
    withMethods(req, ['GET'])
    await withStaff(req, res)

    event = await getEvent(event_id)
    if (!event)
      throw new Error('Event not found')

    if (event.status !== 'scheduled')
      throw new Error('Event not scheduled')

    let user_id = u as string
    const email = m as string
    let user: Member | null = null
    if (user_id) {
      user = await getUser<Member>(user_id)
      if (!user)
        throw new Error('No user found with that ID')
    } else if (email) {
      user = await findUser<Member>(email)
      if (!user)
        throw new Error('No user found with that email address')
      user_id = user.id
    } else {
      throw new Error('No user ID or email provided')
    }

    if (MemberLevel[user.user_type] <= MemberLevel.pledge)
      throw new Error('Only inductees or brothers can check in')

    let invite = (await findInvite(event_id, user_id)) as EventUser

    if (!invite) {
      if (event.invite_only)
        throw new Error('User not invited to this event')
      invite = await registerForEvent(event_id, user_id, 'not_invited')
    }

    return res.redirect('/admin/event/invite/' + invite.id)
  } catch (e) {
    console.error(e)
    let redirect = event ? `/admin/event/${event.id}` : '/admin/events'
    return res.redirect(`${redirect}?error=${e.message}`)
  }
}
