import { MemberFeature, MembershipType, ProductView } from "lib/models";
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

export type ProductPriceView = ProductView & Omit<Stripe.Price, 'type'>

let Products: { [key: string]: ProductView } = null

export async function getProducts(): Promise<{ [key: string]: ProductView }> {
  if (Products) return Products;

  const stripe = getClient()
  const { data: prices } = await stripe.prices.list()
  const plans = await Promise.all(
    prices
      .filter((p) => p.active && p.type === 'recurring')
      .map(async (price) => {
        const product = await stripe.products.retrieve(price.product as string)
        return {
          id: price.id,
          product: product.id,
          name: product.name,
          description: product.description,
          price: price,
          amount: price.unit_amount,
          interval: price.recurring.interval,
          currency: price.currency,
          ...subscriptionData[product.id],
        }
      })
  )

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  const products: { [key: string]: ProductView } = Products = sortedPlans.reduce(
    (acc, { name, price, amount, interval, ...details }) => {
      if (!acc[name]) {
        acc[name] = {
          name,
          priceData: [],
          prices: {},
          ...details,
        }
      }
      acc[name].priceData.push(price)
      acc[name].prices[interval] = amount
      return acc
    },
    {}
  )

  return products
}

export type SubscriptionExtension = {
  type: MembershipType
  features: MemberFeature[]
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null

export * from './client';
export { webhookSecret };

