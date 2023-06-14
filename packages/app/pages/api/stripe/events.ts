import type { Readable } from 'node:stream'

import { IncomingMessage } from 'http'
import { Member } from 'lib/models'
import {
  findUser,
  updateUser,
} from 'lib/services/directus/server/users'
import {
  getBillingEvent,
  saveBillingEvent,
} from 'lib/services/directus/server/users/billing'
import stripe, { webhookSecret } from 'lib/services/stripe/server'
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


export default async function handler(req: NextApiRequest & IncomingMessage, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;
  console.log('Stripe event received')
  try {
    const rawBody = await getRawBody(req)
    const body = Buffer.from(rawBody).toString('utf8')

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    const { id, type, created, data: { object } } = event;
    const data = object as any & { metadata?: { userId?: string } }
    let user = null;
    if (data?.metadata?.userId) {
      user = data.metadata.userId;
    }

    const existingEvent = await getBillingEvent(id)

    if (existingEvent) {
      console.log(`Event ${id} already exists`)
      return res.status(200).json({ received: true });
    }

    await saveBillingEvent({
      id,
      type,
      data,
      user,
      created
    })
  } catch (err) {
    console.error(err)
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'charge.captured':
      const chargeCaptured = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.captured
      const { customer, amount } = chargeCaptured;
      break;
    case 'charge.expired':
      const chargeExpired = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.expired
      break;
    case 'charge.failed':
      const chargeFailed = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.failed
      break;
    case 'charge.pending':
      const chargePending = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.pending
      break;
    case 'charge.refunded':
      const chargeRefunded = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.refunded
      break;
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.succeeded
      break;
    case 'charge.updated':
      const chargeUpdated = event.data.object as Stripe.Charge
      // Then define and call a function to handle the event charge.updated
      break;
    case 'charge.dispute.closed':
      const chargeDisputeClosed = event.data.object as Stripe.Dispute
      // Then define and call a function to handle the event charge.dispute.closed
      break;
    case 'charge.dispute.created':
      const chargeDisputeCreated = event.data.object as Stripe.Dispute
      // Then define and call a function to handle the event charge.dispute.created
      break;
    case 'charge.dispute.funds_reinstated':
      const chargeDisputeFundsReinstated = event.data.object as Stripe.Dispute
      // Then define and call a function to handle the event charge.dispute.funds_reinstated
      break;
    case 'charge.dispute.funds_withdrawn':
      const chargeDisputeFundsWithdrawn = event.data.object as Stripe.Dispute
      // Then define and call a function to handle the event charge.dispute.funds_withdrawn
      break;
    case 'charge.dispute.updated':
      const chargeDisputeUpdated = event.data.object as Stripe.Dispute
      // Then define and call a function to handle the event charge.dispute.updated
      break;
    case 'charge.refund.updated':
      const chargeRefundUpdated = event.data.object as Stripe.Refund
      // Then define and call a function to handle the event charge.refund.updated
      break;
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object as Stripe.Checkout.Session
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object as Stripe.Checkout.Session
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object as Stripe.Checkout.Session
      // Then define and call a function to handle the event checkout.session.expired
      break;
    case 'customer.created':
      const customerCreated = event.data.object as Stripe.Customer
      // Then define and call a function to handle the event customer.created
      await updateUser(customerCreated.metadata.user_id, { customer_id: customerCreated.id })
      break;
    case 'customer.deleted':
      const customerDeleted = event.data.object as Stripe.Customer
      // Then define and call a function to handle the event customer.deleted
      const { id } = await findUser<Member>(customerCreated.metadata.email)
      await updateUser(id, { customer_id: null })
      break;
    case 'customer.updated':
      const customerUpdated = event.data.object as Stripe.Customer
      // Then define and call a function to handle the event customer.updated
      break;
    case 'customer.discount.created':
      const customerDiscountCreated = event.data.object as Stripe.Discount
      // Then define and call a function to handle the event customer.discount.created
      break;
    case 'customer.discount.deleted':
      const customerDiscountDeleted = event.data.object as Stripe.Discount
      // Then define and call a function to handle the event customer.discount.deleted
      break;
    case 'customer.discount.updated':
      const customerDiscountUpdated = event.data.object as Stripe.Discount
      // Then define and call a function to handle the event customer.discount.updated
      break;
    case 'customer.source.created':
      const customerSourceCreated = event.data.object as Stripe.Source
      // Then define and call a function to handle the event customer.source.created
      break;
    case 'customer.source.deleted':
      const customerSourceDeleted = event.data.object as Stripe.Source
      // Then define and call a function to handle the event customer.source.deleted
      break;
    case 'customer.source.expiring':
      const customerSourceExpiring = event.data.object as Stripe.Source
      // Then define and call a function to handle the event customer.source.expiring
      break;
    case 'customer.source.updated':
      const customerSourceUpdated = event.data.object as Stripe.Source
      // Then define and call a function to handle the event customer.source.updated
      break;
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.created
      break;
    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.deleted
      break;
    case 'customer.subscription.paused':
      const customerSubscriptionPaused = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.paused
      break;
    case 'customer.subscription.pending_update_applied':
      const customerSubscriptionPendingUpdateApplied = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.pending_update_applied
      break;
    case 'customer.subscription.pending_update_expired':
      const customerSubscriptionPendingUpdateExpired = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.pending_update_expired
      break;
    case 'customer.subscription.resumed':
      const customerSubscriptionResumed = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.resumed
      break;
    case 'customer.subscription.trial_will_end':
      const customerSubscriptionTrialWillEnd = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.trial_will_end
      break;
    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object as Stripe.Subscription
      // Then define and call a function to handle the event customer.subscription.updated
      break;
    case 'customer.tax_id.created':
      const customerTaxIdCreated = event.data.object as Stripe.TaxId
      // Then define and call a function to handle the event customer.tax_id.created
      break;
    case 'customer.tax_id.deleted':
      const customerTaxIdDeleted = event.data.object as Stripe.TaxId
      // Then define and call a function to handle the event customer.tax_id.deleted
      break;
    case 'customer.tax_id.updated':
      const customerTaxIdUpdated = event.data.object as Stripe.TaxId
      // Then define and call a function to handle the event customer.tax_id.updated
      break;
    case 'promotion_code.created':
      const promotionCodeCreated = event.data.object as Stripe.PromotionCode
      // Then define and call a function to handle the event promotion_code.created
      break;
    case 'promotion_code.updated':
      const promotionCodeUpdated = event.data.object as Stripe.PromotionCode
      // Then define and call a function to handle the event promotion_code.updated
      break;
    case 'refund.created':
      const refundCreated = event.data.object as Stripe.Refund
      // Then define and call a function to handle the event refund.created
      break;
    case 'refund.updated':
      const refundUpdated = event.data.object as Stripe.Refund
      // Then define and call a function to handle the event refund.updated
      break;
    case 'subscription_schedule.aborted':
      const subscriptionScheduleAborted = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.aborted
      break;
    case 'subscription_schedule.canceled':
      const subscriptionScheduleCanceled = event.data.object as Stripe.SubscriptionSchedule
      // Then define and call a function to handle the event subscription_schedule.canceled
      break;
    case 'subscription_schedule.completed':
      const subscriptionScheduleCompleted = event.data.object as Stripe.SubscriptionSchedule
      // Then define and call a function to handle the event subscription_schedule.completed
      break;
    case 'subscription_schedule.created':
      const subscriptionScheduleCreated = event.data.object as Stripe.SubscriptionSchedule
      // Then define and call a function to handle the event subscription_schedule.created
      break;
    case 'subscription_schedule.expiring':
      const subscriptionScheduleExpiring = event.data.object as Stripe.SubscriptionSchedule
      // Then define and call a function to handle the event subscription_schedule.expiring
      break;
    case 'subscription_schedule.released':
      const subscriptionScheduleReleased = event.data.object as Stripe.SubscriptionSchedule
      // Then define and call a function to handle the event subscription_schedule.released
      break;
    case 'subscription_schedule.updated':
      const subscriptionScheduleUpdated = event.data.object as Stripe.SubscriptionSchedule
      // Then define and call a function to handle the event subscription_schedule.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send({});
}

export const config = {
  api: {
    bodyParser: false,
  },
};
