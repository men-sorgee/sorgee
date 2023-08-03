import { EventInvite, EventUser, GroupEvent, Member, MemberLevel, UserType } from 'lib/models'
import { ApiResponse } from 'lib/utils'
import {
  addUserToCongratsEmail,
  getEvent,
  getInvite,
  getUser,
  updateEventUsers,
  updateInvite,
  updateUser,
} from 'lib/services/directus/server'
import { withMethods, withStaff } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function InviteAdmin(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventInvite> | null>
) {
  try {
    withMethods(req, ['GET', 'POST'])
    await withStaff(req, res)
    const { id: invite_id } = req.query
    const { paid: p, signed_waiver: w } = req.body

    const paid = Boolean(p)
    const signed_waiver = Boolean(w)

    const inviteId = Number(invite_id)
    const eventUser = await getInvite(inviteId)
    if (!eventUser)
      throw new Error('Invite not found')

    let event = eventUser.events_id as GroupEvent
    if (typeof event === 'string')
      event = await getEvent(event)

    let member = eventUser.users_id as Member
    if (typeof member === 'string')
      member = await getUser<Member>(member)

    await updateInvite(inviteId, { paid, attended: true })

    let { user_type, rating } = member
    let sendCongratsEmail = false
    // if they are an inductee or pledge, make them a brother
    if (MemberLevel[user_type] == MemberLevel.pledge) {
      user_type = 'brother'
      rating = 5
      sendCongratsEmail = true
    }

    member = await updateUser<Member>(member.id, {
      signed_waiver,
      user_type,
      status: 'active',
      rating
    })

    if (sendCongratsEmail)
      await addUserToCongratsEmail(member.id, 'brother')

    const invite: EventInvite = {
      attended: true,
      paid,
      member,
      event,
      guest: eventUser.guest,
      reason: eventUser.reason,
      rsvp: eventUser.rsvp
    }

    return res.status(200).json(ApiResponse(invite))
  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
