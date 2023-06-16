import { ApiResponse, ProductView } from 'lib/models'
import { getClient, subscriptionData } from 'lib/services/stripe/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stripe = getClient()
    const { data: prices } = await stripe.prices.list()

    const plans = await Promise.all(
      prices
        .filter((p) => p.active)
        .map(async (price) => {
          const product = await stripe.products.retrieve(price.product as string)
          return {
            id: price.id,
            name: product.name,
            description: product.description,
            price: price.unit_amount,
            interval: price.recurring.interval,
            currency: price.currency,
            ...subscriptionData[product.id],
          }
        })
    )

    const sortedPlans = plans.sort((a, b) => a.price - b.price)

    const products: { [key: string]: ProductView } = sortedPlans.reduce(
      (acc, { name, price, interval, ...details }) => {
        if (!acc[name]) {
          acc[name] = {
            name,
            prices: {},
            ...details,
          }
        }

        acc[name].prices[interval] = price
        return acc
      },
      {}
    )
    return res.status(200).json(ApiResponse(Object.values(products)))
  } catch (error) {
    return res.status(500).json(ApiResponse(error))
  }
}
