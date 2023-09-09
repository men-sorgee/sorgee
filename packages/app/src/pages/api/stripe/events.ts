import type { Readable } from 'node:stream';

import { IncomingMessage } from "http";
import { baseUrl } from "lib/config";
import { Member, User, UserPayment } from "lib/models";
import {
  findUser,
  getUser,
  updateInvite,
  updateUser
} from "lib/services/directus/server/users";
import {
  addUserPayment,
  findUserByCustomer,
  findUserPayments,
  saveBillingEvent,
  updateUserPayment
} from "lib/services/directus/server/users/billing";
import {
  getClient,
  subscriptionData,
  webhookSecret
} from "lib/services/stripe/server";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { pruneUndefined } from "../../../lib/utils";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}



export default async function handler(req: NextApiRequest & IncomingMessage, res: NextApiResponse) {
  console.log('Stripe event received')
  const debug = baseUrl.includes('localhost')
  const rawBody = await getRawBody(req)
  const body = Buffer.from(rawBody).toString('utf8')

  let event: Stripe.Event = undefined

  if (!debug) {
    const sig = req.headers['stripe-signature']
    const stripe = getClient()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } else {
    event = JSON.parse(body) as Stripe.Event
  }

  const {
    id,
    type,
    created,
    data: { object },
  } = event

  const data = object as any
  let objectType = data["object"] as string
  const customer = data as Stripe.Customer
  const subscription = data as Stripe.Subscription
  const checkoutSession = data as Stripe.Checkout.Session
  const charge = data as Stripe.Charge
  let { metadata, email, customer: customer_id } = data as any
  let user: User | null = null
  try {
    if (debug)
      console.dir({
        data,
        metadata,
        email,
        objectType,
      })
    let userId = metadata?.userId
    if (userId) {
      if (debug) console.log('userId', userId)
      user = await getUser(userId)
    }

    if (!user) {
      if (debug) console.log('no user')
      let customerId: string = undefined
      switch (objectType) {
        case 'customer':
          customerId = customer.id
          email = customer.email
          break
        default:
          customerId = customer_id
          email = data.billing_details?.email
      }
      if (customerId) {
        if (debug) console.log('customerId', customerId)
        user = await findUserByCustomer(customerId)
      }
      else if (email) {
        if (debug) console.log('email', email)
        user = await findUser(customer.email)
      }
    }


    const billingEvent = {
      id,
      type,
      data,
      user: user?.id || null,
      created,
    }

    if (debug) console.dir({
      billingEvent
    })

    await saveBillingEvent(billingEvent)
  } catch (err) {
    console.error(err)
  }

  if (user == null) {
    return res.status(200).json({ received: true, user: false })
  }

  try {

    // Handle the event payloads accordingly
    switch (event.type) {
      case 'checkout.session.completed': {
        const { date_created, product_type, amount, redeemed_id, payment_intent, ...data } = extractFromCheckout(checkoutSession)
        const existing = await findUserPayments(user.id, {
          payment_intent: String(payment_intent)
        })
        if (existing) return
        switch (product_type) {
          case 'subscription': {
            await addUserPayment({
              ...data,
              amount,
              product_type,
              redeemed_id,
              payment_intent,
              user: user.id,
            })
            break;
          }
          case 'event': {
            const payment = await addUserPayment({
              ...data,
              product_type,
              amount,
              redeemed_id,
              payment_intent,
              user: user.id,
            })
            if (redeemed_id) {
              await updateInvite(Number(redeemed_id), {
                paid: true,
                rsvp: 'confirmed',
                amount,
                paid_at: date_created,
                confirmed_at: new Date().toISOString(),
                payment: payment.id,
              })
            }
            break;
          }
        }
        break
      }
      case 'charge.succeeded': {
        break;
      }
      case 'charge.refunded': {
        const { payment_intent, amount } = extractFromCharge(charge)
        const payment = await findUserPayments(user.id, {
          payment_intent: String(payment_intent)
        })
        if (payment) {
          await updateUserPayment(payment.id, {
            status: 'refunded',
            description: `Refunded $${amount} for ${payment.description}`
          })
          if (!payment.redeemed_id) return
          switch (payment.product_type) {
            case 'event': {
              await updateInvite(Number(payment.redeemed_id), {
                rsvp: 'cancelled',
                paid: false,
                paid_at: null,
                confirmed_at: null,
                amount: 0
              })
              break;
            }
            case 'subscription': {
              // do nothing for now
            }
          }
        }
        break;
      }
      case 'customer.created':
      case 'customer.updated': {
        if (customer.id && customer.id != user.customer_id)
          await updateUser(user.id, { customer_id: customer.id })
        break
      }
      case 'customer.deleted': {
        await updateUser(user.id, {
          customer_id: null,
          membership_type: 'none',
          has_features: [],
          renewal_type: null,
        })
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.resumed':
      case 'customer.subscription.updated':
        {
          const membershipData = extractFromSubscription(subscription, user)
          await updateUser(user.id, membershipData)
          const payment = await findUserPayments(user.id, {
            redeemed_id: String(membershipData.subscription_id)
          })
          if (payment)
            await updateUserPayment(payment.id, {
              date_created: membershipData.membership_start,
              description: `Membership ${membershipData.renewal_type} payment for ${membershipData.membership_type}`,
            })
          break;
        }
      case 'customer.subscription.pending_update_expired':
        {
          const { membership_end } = extractFromSubscription(subscription, user)
          await updateUser(user.id, {
            has_features: [],
            membership_type: 'none',
            renewal_type: null,
            membership_end
          })
          break
        }

      case 'customer.subscription.deleted':
        {
          const { membership_end } = extractFromSubscription(subscription, user)
          await updateUser(user.id, {
            has_features: [],
            membership_type: 'none',
            renewal_type: null,
            membership_end
          })
          break
        }
      case 'customer.subscription.paused':
        {
          const { membership_end } = extractFromSubscription(subscription, user)
          await updateUser(user.id, {
            has_features: [],
            membership_type: 'none',
            renewal_type: null,
            membership_end
          })
          break
        }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true, user: true })
  } catch (err) {
    console.error(err)
    console.error(err.errors[0].message)
    res.status(200).json({ received: true, user: true, error: err.message })
  }
}

export type MemberShipData = Pick<Member,
  'subscription_id' |
  'customer_id' |
  'has_features' |
  'membership_type' |
  'membership_start' |
  'membership_end' |
  'renewal_type'
>

function extractFromSubscription(subscription: Stripe.Subscription, user: User): MemberShipData {
  const {
    id: subscription_id,
    customer,
    status,
    start_date,
    ended_at,
    items: { data: items },
  } = subscription
  const item = items[0]
  const { plan } = item
  const product: string = plan.product as string
  let { type: membership_type, features } = subscriptionData[product]
  const renewal_type = item.price?.recurring?.interval as 'month' | 'year'

  let active = status == 'active'
  let has_features = active ? features : user.has_features
  membership_type = active ? membership_type : user.membership_type || 'free'

  const data = {
    subscription_id,
    customer_id: customer as string,
    has_features,
    membership_type,
    membership_start: start_date ? new Date(start_date * 1000).toISOString() : new Date().toISOString(),
    membership_end: ended_at ? new Date(ended_at * 1000).toISOString() : null,
    renewal_type
  }
  return pruneUndefined<MemberShipData>(data)
}

function extractFromCheckout(checkout: Stripe.Checkout.Session): Partial<UserPayment> {
  const { amount_total: amount, created, currency, metadata, mode, payment_intent, subscription } = checkout
  const { name, inviteId, userId } = metadata

  const type = mode == 'payment' ? 'event' : mode
  let payment: UserPayment = {
    user: userId,
    type: 'stripe',
    amount: amount / 100,
    currency: currency as any,
    redeemed_id: type == 'subscription' ? String(subscription) : inviteId,
    payment_intent: payment_intent ? String(payment_intent) : undefined,
    product_type: type as any,
    description: name + (type == 'subscription' ? ' Membership' : 'Event'),
    date_created: new Date(created * 1000).toISOString(),
    redeemed: type == 'subscription',
    status: 'collected'
  }
  return pruneUndefined(payment) as Partial<UserPayment>
}

function extractFromCharge(charge: Stripe.Charge): Partial<UserPayment> {
  const { amount, amount_refunded, created, currency, metadata, payment_intent, receipt_url: receipt } = charge
  const { eventId, userId } = metadata

  const payment = {
    user: userId,
    amount: amount_refunded ? amount_refunded / 100 : amount / 100,
    currency: currency as any,
    redeemed_id: eventId || userId,
    payment_intent: String(payment_intent),
    date_created: new Date(created * 1000).toISOString(),
    receipt
  }

  return pruneUndefined(payment) as Partial<UserPayment>
}

export const config = {
  api: {
    bodyParser: false,
  },
}
