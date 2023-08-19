import { baseUrl } from "lib/config";
import { Member, ProductView } from "lib/models";
import { updateUser } from "lib/services/directus/server";
import { subscriptionData } from "lib/services/stripe/client";
import { getClient } from "lib/services/stripe/server";
import { ApiResponse, withMember } from "lib/utils/server";
import Stripe from "stripe";

export default async function SubscribeProduct(req, res) {
  try {
    let member = await withMember(req, res)

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
            price: price.unit_amount,
            interval: price.recurring.interval,
            currency: price.currency,
            ...subscriptionData[product.id],
          } as ProductView & Omit<Stripe.Price, 'type'>
        })
    )

    if (!member.customer_id) {
      const { id, email, first_name, last_name } = member

      const customer = await stripe.customers.create({
        email,
        name: first_name + ' ' + last_name,
        metadata: {
          userId: id,
        },
      })

      member = await updateUser<Member>(member.id, {
        customer_id: customer.id,
      })
    }

    const { price_id } = req.query
    const priceId = String(price_id)
    const price = plans.find(p => p.id = priceId)
    if (!price) throw new Error('Price not found')

    const session = await stripe.checkout.sessions.create({
      customer: member.customer_id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1, },],
      metadata: {
        name: price.name,
        description: price.description,
        userId: member.id,
        type: 'subscription'
      },
      client_reference_id: member.id,
      allow_promotion_codes: true,
      subscription_data: {
        description: price.description,
        metadata: {
          name: price.name,
          userId: member.id,
          type: 'subscription'

        },
      },
      cancel_url: `${baseUrl}/member/subscription/cancelled?product=${price.product}`,
      success_url: `${baseUrl}/member/subscription/success?product=${price.product}`
    })

    res.json(ApiResponse({
      id: session.id,
      amount: session.amount_total,
      ...session
    }))
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
