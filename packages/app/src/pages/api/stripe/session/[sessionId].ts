import { ApiResponse } from 'lib/models'
import { getClient } from 'lib/services/stripe/server'
import { withMember } from 'lib/utils/server'
import Stripe from 'stripe'

const handler = async (req, res) => {
  try {
    let member = await withMember(req, res)
    const stripe = getClient()

    const { sessionId } = req.query

    const session = await stripe.checkout.sessions.retrieve(sessionId as string)
    if (!session) throw new Error('Session not found')
    if (session.customer !== member.customer_id)
      throw new Error('Session not found')

    res.json(ApiResponse<Stripe.Checkout.Session>(session))
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
