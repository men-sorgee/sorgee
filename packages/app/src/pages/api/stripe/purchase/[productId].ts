import { baseUrl } from 'lib/config'
import { Member, ApiResponse } from 'lib/models'
import { updateUser } from 'lib/services/directus/server'
import { getClient } from 'lib/services/stripe/server'
import { withMember } from 'lib/utils/server'

export default async function PurchaseProduct(req, res) {
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

    const { productId } = req.query

    const lineItems = [
      {
        price: productId,
        quantity: 1
      },
    ]

    const session = await stripe.checkout.sessions.create({
      customer: member.customer_id,
      mode: 'subscription',
      line_items: lineItems,
      metadata: {
        userId: member.id,
      },
      client_reference_id: member.id,
      allow_promotion_codes: true,
      cancel_url: `${baseUrl}/member/subscription/cancelled?product=${productId}`,
      success_url: `${baseUrl}/member/subscription/success?product=${productId}`
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
