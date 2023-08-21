import {
  MemberFeature,
  MembershipType,
  PriceView,
  ProductView
} from "lib/models";
import { subscriptionData } from "lib/services/stripe/client";
import StripeClient, { Stripe } from "stripe";

let stripeClient: StripeClient = null

export function getClient() {
  if (stripeClient != null) return stripeClient
  stripeClient = new StripeClient(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
    typescript: true,
    stripeAccount: process.env.STRIPE_ACCOUNT_ID,
    appInfo: {
      name: 'Guys N Heat',
      version: '0.1.0',
    },
  })
  return stripeClient
}

export type ProductPriceView = PriceView & Omit<Stripe.Price, 'type'>




export async function getProductPrices(): Promise<ProductView[]> {

  const stripe = getClient()
  const { data: products } = await stripe.products.list({
    type: 'service',
    active: true
  })

  const plans = await Promise.all(
    products
      .filter((product) => subscriptionData[product.id]?.enabled)
      .map(async (product) => {

        const { data: prices } = await stripe.prices.list({
          active: true,
          type: 'recurring',
          product: product.id
        })
        const { id, name, description } = product
        return {
          id,
          name,
          description,
          currency: 'usd',
          type: subscriptionData[product.id].type,
          features: subscriptionData[product.id].features,
          label: subscriptionData[product.id].label,
          prices: prices.filter(p => p.active).map((price) => {
            return {
              id: price.id,
              amount: price.unit_amount / 100,
              interval: price.recurring.interval,
            }
          })
        } as ProductView
      })
  )

  plans.forEach((plan) => {
    // sort prices
    plan.prices = plan.prices.sort((a, b) => a.amount - b.amount)
  })

  // sort plans
  const sortedPlans = plans.sort((a, b) => a.prices[0].amount - b.prices[0].amount)

  return sortedPlans
}

export type SubscriptionExtension = {
  type: MembershipType
  features: MemberFeature[]
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null

export * from './client';
export { webhookSecret };

