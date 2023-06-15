import type { Readable } from 'node:stream'

import { IncomingMessage } from 'http'
import { User } from 'lib/models'
import {
  findUser,
  getUser,
  updateUser,
} from 'lib/services/directus/server/users'
import {
  findUserByCustomer,
  saveBillingEvent,
} from 'lib/services/directus/server/users/billing'
import {
  getClient,
  subscriptionData,
  webhookSecret,
} from 'lib/services/stripe/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import Stripe from 'stripe'

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function extractFromSubscription(subscription: Stripe.Subscription & any) {
  const { customer, status, plan, start_date: start, items } = subscription
  const { product } = plan
  const { type, features } = subscriptionData[product]
  const interval = items.data[0]?.price?.recurring?.interval
  return {
    type,
    customer,
    product,
    status,
    features,
    start: new Date(start).toISOString(),
    interval
  }
}

export default async function handler(req: NextApiRequest & IncomingMessage, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'];
  const stripe = getClient();
  let event: Stripe.Event;
  console.log('Stripe event received')

  const rawBody = await getRawBody(req)
  const body = Buffer.from(rawBody).toString('utf8')

  event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

  const { id, type, created, data: { object: data } } = event;
  const { object: dataType } = data as any

  let user: User | null = null

  const customer = data as Stripe.Customer
  const subscription = data as Stripe.Subscription

  switch (dataType) {
    case 'customer':
      let { userId } = customer.metadata || {}
      if (!userId) {
        user = await getUser(userId)
      } else {
        user = await findUser(customer.email)
      }
      break
    case 'subscription':
      const { customer: customerId } = extractFromSubscription(subscription)
      user = (await findUserByCustomer(customerId)) as User
      break
  }

  try {
    await saveBillingEvent({
      id,
      type,
      data,
      user: user?.id,
      created
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
    case 'customer.created':
    case 'customer.updated':
      await updateUser(user.id, { customer_id: customer.id })
      break;
    case 'customer.deleted':
      await updateUser(user.id, { customer_id: null, membership_type: 'none', has_features: [], renewal_type: null })
      break
    case 'customer.subscription.created':
    case 'customer.subscription.resumed':
    case 'customer.subscription.updated':
      let {
        customer: customer_id,
        type: membership_type,
        features,
        start: membership_start,
        status,
        interval: renewal_type } = extractFromSubscription(subscription)

      let active = status == 'active'
      let has_features = active ? features : user.has_features
      membership_type = active ? membership_type : user.membership_type || 'free'

      await updateUser(user.id, {
        customer_id,
        has_features,
        membership_type,
        membership_start,
        renewal_type
      })
      break

    case 'customer.subscription.deleted':
    case 'customer.subscription.paused':
    case 'customer.subscription.expired':
      await updateUser(user.id, {
        has_features: [],
        membership_type: 'none',
        renewal_type: null,
      })
      break

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
