import { baseUrl } from "lib/config";
import { Member } from "lib/models";
import { updateUser } from "lib/services/directus/server";
import { getClient, getProductPrices } from "lib/services/stripe/server";
import { ApiResponse, withMember } from "lib/utils/server";

export default async function SubscribeProduct(req, res) {
  try {
    let member = await withMember(req, res)
    const stripe = getClient()

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

    const products = await getProductPrices()

    const product = products.find(product => product.prices.find(price => price.id == priceId))
    if (!product) throw new Error('Product price not found')
    const session = await stripe.checkout.sessions.create({
      customer: member.customer_id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1, },],
      metadata: {
        name: product.name,
        description: product.description,
        userId: member.id,
        type: 'subscription'
      },
      client_reference_id: member.id,
      allow_promotion_codes: true,
      subscription_data: {
        description: product.description,
        metadata: {
          name: product.name,
          userId: member.id,
          type: 'subscription'

        },
      },
      cancel_url: `${baseUrl}/member/subscription?cancelled=true&product=${product.id}&price=${priceId}`,
      success_url: `${baseUrl}/member/subscription/success?price=${priceId}`
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
