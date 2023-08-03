import { EventInvite, GroupEvent, Member } from "lib/models";
import { getEvent, getInvite, getUser } from "lib/services/directus/server";
import { ApiResponse, withMethods, withStaff } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function InviteAdmin(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventInvite> | null>
) {
  try {
    withMethods(req, ['GET'])
    await withStaff(req, res)
    let { id: invite_id } = req.query

    const inviteId = Number(invite_id)
    const eventUser = await getInvite(inviteId)
    if (!eventUser)
      throw new Error('Invite not found')

    let event = eventUser.events_id as GroupEvent
    if (typeof event === 'string')
      event = await getEvent(event)

    if (!event)
      throw new Error('Event not found')

    let member = eventUser.users_id as Member
    if (typeof member === 'string')
      member = await getUser<Member>(member)

    if (!member)
      throw new Error('Member not found')

    const { id, attended, paid, rsvp, guest, reason } = eventUser
    let invite: EventInvite = {
      id,
      member,
      event,
      attended,
      paid,
      rsvp,
      guest,
      reason
    }

    return res.status(200).json(ApiResponse(invite))

  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
