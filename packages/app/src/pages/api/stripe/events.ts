import type { Readable } from 'node:stream'

import { IncomingMessage } from 'http'
import { User } from 'lib/models'
import { findUser, getUser, updateInvite, updateUser } from 'lib/services/directus/server/users'
import { findUserByCustomer, saveBillingEvent } from 'lib/services/directus/server/users/billing'
import { getClient, subscriptionData, webhookSecret } from 'lib/services/stripe/server'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { chakra } from '@chakra-ui/react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

function extractFromSubscription(subscription: Stripe.Subscription & any) {
  const { id, customer, status, plan, start_date: start, items } = subscription
  const { product } = plan
  const { type, features } = subscriptionData[product]
  const interval = items.data[0]?.price?.recurring?.interval
  return {
    id,
    type,
    customer,
    product,
    status,
    features,
    start: new Date(start).toISOString(),
    interval,
  }
}

export default async function handler(req: NextApiRequest & IncomingMessage, res: NextApiResponse) {
  const sig = req.headers['stripe-signature']
  const stripe = getClient()
  let event: Stripe.Event
  console.log('Stripe event received')

  const rawBody = await getRawBody(req)
  const body = Buffer.from(rawBody).toString('utf8')

  event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

  const {
    id,
    type,
    created,
    data: { object: data },
  } = event
  const { object: dataType } = data as any

  let user: User | null = null

  const customer = data as Stripe.Customer
  const subscription = data as Stripe.Subscription
  const checkoutSession = data as Stripe.Checkout.Session

  try {
    switch (dataType) {
      case 'customer':
        const { id } = customer || {}
        if (!id) {
          user = (await findUserByCustomer(id)) as User
        } else {
          user = await findUser(customer.email)
        }
        break
      case 'subscription':
        const { id: subscriptionId, customer: customerId } = extractFromSubscription(subscription)
        user = (await findUserByCustomer(customerId)) as User
        break
      case 'checkout.session':
        const { metadata: {
          userId,
        } } = checkoutSession
        user = await getUser(userId)
        break
    }


    await saveBillingEvent({
      id,
      type,
      data,
      user: user?.id || null,
      created,
    })
  } catch (err) {
    console.warn(err)
    // process event anyway
  }

  if (user == null) {
    return res.status(200).json({ received: true })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const { metadata: {
        inviteId,
      } } = checkoutSession
      if (inviteId)
        await updateInvite(Number(inviteId), { paid: true, rsvp: 'confirmed' })
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
      let {
        id: subscription_id,
        customer: customer_id,
        type: membership_type,
        features,
        start: membership_start,
        status,
        interval: renewal_type,
      } = extractFromSubscription(subscription)

      let active = status == 'active'
      let has_features = active ? features : user.has_features
      membership_type = active ? membership_type : user.membership_type || 'free'

      await updateUser(user.id, {
        subscription_id,
        customer_id,
        has_features,
        membership_type,
        membership_start,
        renewal_type,
      })
      break
    case 'customer.subscription.expired':
    case 'customer.subscription.deleted':
      await updateUser(user.id, {
        has_features: [],
        membership_type: 'none',
        renewal_type: null,
        subscription_id: null,
      })
      break
    case 'customer.subscription.paused':
      await updateUser(user.id, {
        has_features: [],
        membership_type: 'none',
        renewal_type: null,
      })
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
