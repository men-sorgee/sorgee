import type { Readable } from 'node:stream';

import { IncomingMessage } from "http";
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
  saveBillingEvent
} from "lib/services/directus/server/users/billing";
import {
  getClient,
  subscriptionData,
  webhookSecret
} from "lib/services/stripe/server";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { baseUrl } from "../../../lib/config";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}



export default async function handler(req: NextApiRequest & IncomingMessage, res: NextApiResponse) {
  console.log('Stripe event received')

  const rawBody = await getRawBody(req)
  const body = Buffer.from(rawBody).toString('utf8')

  const verify = baseUrl.includes('localhost') ? false : true
  let event: Stripe.Event = undefined

  if (verify) {
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
    data: { object: data },
  } = event

  let user: User | null = null
  let objectType = data["object"] as string

  const customer = data as Stripe.Customer
  const subscription = data as Stripe.Subscription
  const checkoutSession = data as Stripe.Checkout.Session
  const { metadata, email } = data as any

  try {
    console.dir({
      data,
      metadata,
      email,
      objectType,
    })
    let userId = metadata?.userId
    if (userId) {
      console.log('userId', userId)
      user = await getUser(userId)
    }

    if (!user) {
      console.log('no user')
      let customerId: string = undefined
      switch (objectType) {
        case 'customer':
          customerId = customer.id
          break
        case 'subscription':
          customerId = subscription.customer as string
          break
        case 'checkout.session':
          customerId = checkoutSession.customer as string
          break
      }
      if (customerId) {
        console.log('customerId', customerId)
        user = await findUserByCustomer(customerId)
      }
      else if (email) {
        console.log('email', email)
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
    console.dir({
      billingEvent
    })

    await saveBillingEvent(billingEvent)
  } catch (err) {
    console.error(err)
  }

  if (user == null) {
    return res.status(200).json({ received: true, user: false })
  }

  // Handle the event payloads accordingly
  switch (event.type) {
    case 'checkout.session.completed':
      const payment = extractFromCheckout(checkoutSession)
      await addUserPayment(payment)
      const { product_type, amount } = payment
      let inviteId = payment.redeemed_id
      if (product_type == 'event' && inviteId) {
        await updateInvite(Number(inviteId), { paid: true, rsvp: 'confirmed', amount })
      }
      break

    case 'customer.created':
    case 'customer.updated':
      await updateUser(user.id, { customer_id: customer.id })
      break

    case 'customer.deleted':
      await updateUser(user.id, {
        customer_id: null,
        membership_type: 'none',
        has_features: [],
        renewal_type: null,
      })
      break

    case 'customer.subscription.created':
    case 'customer.subscription.resumed':
    case 'customer.subscription.updated':

      const membershipData = extractFromSubscription(subscription, user)
      await updateUser(user.id, membershipData)
      break

    case 'customer.subscription.expired':
      const { membership_start, membership_end } = extractFromSubscription(subscription, user)
      await updateUser(user.id, {
        has_features: [],
        membership_type: 'none',
        renewal_type: null,
        membership_start,
        membership_end,
      })
      break

    case 'customer.subscription.deleted':
      await updateUser(user.id, {
        has_features: [],
        membership_type: 'none',
        renewal_type: null,
        subscription_id: null,
        membership_start: null,
        membership_end: null,
      })
      break

    case 'customer.subscription.paused':
      await updateUser(user.id, {
        has_features: [],
        membership_type: 'none',
        renewal_type: null,
        membership_start,
        membership_end,
      })
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true, user: true })
}

function extractFromSubscription(subscription: Stripe.Subscription, user: User): Pick<Member,
  'subscription_id' |
  'customer_id' |
  'has_features' |
  'membership_type' |
  'membership_start' |
  'membership_end' |
  'renewal_type'
> {
  const {
    id: subscription_id,
    customer,
    status,
    current_period_start,
    current_period_end,
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

  return {
    subscription_id,
    customer_id: customer as string,
    has_features,
    membership_type,
    membership_start: new Date(current_period_start).toISOString(),
    membership_end: new Date(current_period_end).toISOString(),
    renewal_type,
  }
}

function extractFromCheckout(checkout: Stripe.Checkout.Session): UserPayment {
  const { amount_total: amount, created, currency, metadata, mode } = checkout
  const { eventId, userId } = metadata

  const type = mode == 'payment' ? 'event' : mode
  let payment: UserPayment = {
    user: userId,
    type: 'stripe',
    amount: amount / 100,
    currency: currency as any,
    redeemed_id: eventId || userId,
    product_type: type as any,
    description: `Brotherhood payment for ${type} ${eventId || userId}`,
    date_created: new Date(created).toISOString(),
    redeemed: false,
    status: 'collected'
  }
  return payment
}

export const config = {
  api: {
    bodyParser: false,
  },
}
