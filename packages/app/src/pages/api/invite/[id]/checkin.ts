import { EventInvite, GroupEvent, Member, MemberLevel } from "lib/models";
import {
  addUserToCongratsEmail,
  getEvent,
  getInvite,
  getUser,
  updateInvite,
  updateUser
} from "lib/services/directus/server";
import {
  addUserPayment,
  findUserPayment,
  updateUserPayment
} from "lib/services/directus/server/users/billing";
import { ApiResponse, withMethods, withStaff } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function InviteAdmin(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventInvite> | null>
) {
  try {
    withMethods(req, ['GET', 'POST'])
    await withStaff(req, res)
    const { id: invite_id } = req.query
    const { paid: p, signed_waiver: w, amount: a } = req.body

    const paid = Boolean(p)
    const amount = Number(a || "0")
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

    await updateInvite(inviteId, { paid, attended: true, amount })
    if (paid) {
      if (amount < event.cost)
        throw new Error('Amount paid is less than the cost of the event')

      let donation = amount - event.cost
      const payment = await findUserPayment(member.id, event.id)
      if (payment) {
        await updateUserPayment(payment.id, { redeemed: true, date_redeemed: new Date().toISOString() })
      } else {
        await addUserPayment({
          amount: event.cost,
          description: `Paid for ${event.name} (${event.id})`,
          user: member.id,
          currency: 'usd',
          product_type: 'event',
          type: 'cash',
          redeemed: true,
          status: 'collected',
          redeemed_id: event.id,
          date_redeemed: new Date().toISOString()
        })
      }
      if (donation > 0) {
        await addUserPayment({
          amount: donation,
          description: `Donated at ${event.name} (${event.id})`,
          user: member.id,
          currency: 'usd',
          product_type: 'donation',
          type: 'cash',
          redeemed: true,
          date_redeemed: new Date().toISOString(),
          status: 'collected'
        })
      }
    }

    let { user_type, rating } = member
    let sendCongratsEmail = false
    // if they are an inductee or pledge, make them a brother
    if (MemberLevel[user_type] == MemberLevel.pledge) {
      user_type = 'brother'
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
      amount,
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
