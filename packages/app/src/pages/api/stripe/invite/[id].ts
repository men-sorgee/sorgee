
import { differenceInHours } from "date-fns";
import { baseUrl } from "lib/config";
import { GroupEvent, Member } from "lib/models";
import {
  findUserPayment,
  getInvite,
  updateUser
} from "lib/services/directus/server";
import {
  getClient,
  PurchaseResponse,
  RefundResponse
} from "lib/services/stripe/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function InvitePayment(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<PurchaseResponse | RefundResponse> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['GET', 'DELETE'])
    let member = await withMember(req, res)

    const { id } = req.query

    const invite = await getInvite(Number(id))
    const event = invite.events_id as GroupEvent
    const { id: eventId, cost } = event

    const stripe = getClient()

    if (method == 'GET') {
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

      const name = `Brotherhood Event: ${new Date(event.datetime).toLocaleDateString()}`

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: cost * 100,
            product_data: {
              name,
              description: event.name,
              metadata: {
                name,
                eventId: String(eventId),
                inviteId: String(id),
                type: 'event',
              }
            },
            tax_behavior: 'inclusive',
          },
        },

      ]

      const session = await stripe.checkout.sessions.create({
        customer: member.customer_id,
        mode: 'payment',
        line_items,
        metadata: {
          name,
          userId: member.id,
          inviteId: String(id),
          eventId,
          type: 'event'
        },
        payment_intent_data: {
          description: name,
          metadata: {
            name,
            userId: member.id,
            inviteId: String(id),
            eventId,
            type: 'event'
          },
          receipt_email: member.email,
          statement_descriptor: 'Brotherhood Event',
        },
        allow_promotion_codes: true,
        cancel_url: `${baseUrl}/events/${String(eventId)}?result=cancelled`,
        success_url: `${baseUrl}/events/${String(eventId)}?result=success`
      })

      return res.status(200).json(ApiResponse<PurchaseResponse>({
        id: session.id
      }))
    } else if (method == 'DELETE') {
      const payment = await findUserPayment(member.id, event.id)

      if (!payment || !payment.payment_intent)
        return res.status(200).json(ApiResponse<RefundResponse>({
          paid: false,
          refunded: false,
          reason: 'No payment captured',
          continue: true
        }))

      if (event.status == 'occurred')
        throw new Error('Event has already passed or is no longer available.')

      if (differenceInHours(new Date(event.datetime), new Date()) < 24)
        return res.status(200).json(ApiResponse<RefundResponse>({
          paid: true,
          refunded: false,
          reason: 'Cancellation was within 24 hours of event start time.',
          continue: true
        }))

      if (payment.status == 'refunded')
        return res.status(200).json(ApiResponse<RefundResponse>({
          paid: true,
          refunded: true,
          reason: 'Already refunded',
          continue: true
        }))

      const { reason } = req.body
      try {
        const refund = await stripe.refunds.create({
          payment_intent: payment.payment_intent,
          reason: "requested_by_customer",
          currency: payment.currency,
          metadata: {
            reason,
          },
          amount: payment.amount,
        })

        return res.status(200).json(ApiResponse<RefundResponse>({
          paid: true,
          refunded: refund.status == 'succeeded',
          reason: refund.failure_reason,
          continue: true
        }))
      } catch (error) {
        return res.status(200).json(ApiResponse<RefundResponse>({
          paid: true,
          refunded: false,
          reason: error.message,
          continue: false
        }))
      }
    }

  } catch (error) {
    console.log(error.response?.raw || error)
    res.status(500).json(ApiResponse(null, error.response?.raw || error.message))
  }
}
