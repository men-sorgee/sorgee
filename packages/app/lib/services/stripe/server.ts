import {
  MemberFeature,
  MembershipType,
} from 'lib/models'
import StripeClient from 'stripe'

let stripeClient: StripeClient = null

export function getClient() {
  if (stripeClient != null) return stripeClient
  stripeClient = new StripeClient(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
    typescript: true,
    stripeAccount: process.env.STRIPE_ACCOUNT_ID,
    appInfo: {
      name: 'Guys N Heat',
      version: '0.1.0'
    }
  })
  return stripeClient
}

export type SubscriptionExtension = {
  type: MembershipType
  features: MemberFeature[]
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null

export { webhookSecret }
export * from './client'
