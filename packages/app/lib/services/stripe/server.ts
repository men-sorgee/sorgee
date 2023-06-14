import { Subscription } from 'lib/models/billing'
import StripeClient from 'stripe'

import { MembershipType } from '../../models'

const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
  typescript: true,
  stripeAccount: process.env.STRIPE_ACCOUNT_ID,
  appInfo: {
    name: 'Guys N Heat',
    version: '0.1.0'
  }
})

export default stripe;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null

const subscriptions: Subscription[] = [
  {
    id: 'prod_O1PIu1Fr6aHIYV',
    type: MembershipType.Free,
    name: "(Nearly) Free Plan",
    price: {
      monthly: 1,
      annualy: 10,
    },
    description: "This Plan adds the ability to browse the member directory. This plan is perfect for those who want to get a feel for our platform and see what we have to offer.",
    features: ['view_directory', 'flirt'],
  },
  {
    id: 'prod_O1PIu1Fr6aHIYV',
    type: MembershipType.Basic,
    name: "Basic Plan",
    price: {
      monthly: 10,
      annualy: 100,
    },
    description: `Our Basic Plan adds Event Attendee Details and the Buddy List. With this plan, you can view all the details of events and add Brothers to your Buddy List for easy access. You will also have access to all the features of the Free Plan.`,
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list'],
  },
  {
    id: 'prod_O1PVvHrcOFN9kR',
    type: MembershipType.Plus,
    name: "Plus Plan",
    price: {
      monthly: 20,
      annualy: 200,
    },
    description: `With this plan, you can connect with other members through our chat feature and share private photos with those you trust. You will also have access to all the features of the Free and Basic Plans.`,
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list', 'chat', 'share_photos'],
  },
  //{
  //  id: 'prod_O1PLlZtT5hyf8s',
  //  type: MembershipType.Pro,
  //  name: "Pro Plan",
  //  price: {
  //    monthly: 20,
  //    annualy: 200,
  //  },
  //  description: `With this plan, you can connect with other members through our chat feature and share private photos with those you trust. You will also have access to all the features of the Free and Basic Plans.`,
  //  features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list', 'chat', 'share_photos', 'private_events'],
  //}
]

export function getSubscriptions() {
  return subscriptions
}

export function getSubscription(id: string) {
  return subscriptions.find(sub => sub.id === id)
}

export { webhookSecret }
