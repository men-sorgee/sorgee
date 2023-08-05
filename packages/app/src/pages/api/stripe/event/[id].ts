
import { baseUrl } from "lib/config";
import { GroupEvent, Member } from "lib/models";
import { getEvent, getInvite, updateUser } from "lib/services/directus/server";
import { getClient } from "lib/services/stripe/server";
import { ApiResponse, withMember } from "lib/utils/server";
import Stripe from "stripe";

export default async function PurchaseProduct(req, res) {
  try {
    let member = await withMember(req, res)

    const { id } = req.query

    const invite = await getInvite(Number(id))
    const event = invite.events_id as GroupEvent
    const { id: eventId, cost } = event

    const stripe = getClient()

    if (!member.customer_id) {
      const { id, email, first_name, last_name } = member

      const customer = await stripe.customers.create({
        email,
        name: first_name + ' ' + last_name,
        metadata: {
          userId: id,
        },
      })

      member = await updateUser<Member>(member.id, {
        customer_id: customer.id,
      })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: cost * 100,
          product_data: {
            name: `Brotherhood Event: ${new Date(event.datetime).toLocaleDateString()}`,
            description: event.name,
            metadata: {
              eventId: String(eventId),
              inviteId: String(id),
              type: 'event',
            }
          },
          tax_behavior: 'inclusive',

        }
      },
    ]

    const session = await stripe.checkout.sessions.create({
      customer: member.customer_id,
      mode: 'payment',
      line_items,
      metadata: {
        userId: member.id,
        inviteId: id,
        eventId,
      },
      allow_promotion_codes: true,
      cancel_url: `${baseUrl}/events/${String(eventId)}`,
      success_url: `${baseUrl}/events/${String(eventId)}`
    })

    res.status(200).json(ApiResponse({
      id: session.id
    }))
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
