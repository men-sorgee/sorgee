import StripeClient from 'stripe'

import {
  MemberFeature,
  MembershipType,
} from '../../models'

let stripeClient: StripeClient

export function getClient() {
  if (stripeClient) return stripeClient
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
const publicKey = process.env.STRIPE_PUBLIC_KEY || null

const subscriptionData = {
  'prod_O1Vn4HTEQ7zIi4': {
    type: MembershipType.Free,
    features: ['view_directory', 'flirt'],
  },
  'prod_O1PIu1Fr6aHIYV': {
    type: MembershipType.Basic,
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list'],
    label: 'Popular'
  },
  'prod_O1PVvHrcOFN9kR': {
    type: MembershipType.Plus,
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list', 'chat', 'share_photos'],
  },
  'prod_O1PLlZtT5hyf8s': {
    type: MembershipType.Pro,
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list', 'chat', 'share_photos', 'private_events'],
  }
}

export { publicKey, subscriptionData, webhookSecret }
