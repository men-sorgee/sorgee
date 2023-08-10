import { EventInvite, GroupEvent, Member } from "lib/models";
import { getInvite } from "lib/services/directus/server";
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

    const { id, attended, paid, rsvp, guest, reason, amount, users_id, events_id } = eventUser
    let invite: EventInvite = {
      id,
      member: users_id as Member,
      event: events_id as GroupEvent,
      attended,
      paid,
      rsvp,
      guest,
      reason,
      amount
    }

    return res.status(200).json(ApiResponse(invite))

  } catch (e) {
    console.error(e)
    return res.status(500).json(ApiResponse(null, e.message))
  }
}
