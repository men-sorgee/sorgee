import { updateUser } from "lib/services/directus/server";
import { getClient } from "lib/services/stripe/server";
import { withMethods, withUser } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { callbackUrl = '/member/account/plan' } = req.query

  try {
    withMethods(req, ['GET'])
    let user = await withUser(req, res)

    const stripe = getClient()
    const { subscription_id, notes } = user
    if (!subscription_id)
      throw new Error('User does not have a subscription')

    let subscription = await stripe.subscriptions.cancel(user.subscription_id)
    if (!subscription)
      throw new Error('Unable to cancel subscription')

    await updateUser(user.id, {
      notes: `${notes}\nCancelled subscription via app at ${new Date().toISOString()}`
    })
  } catch (error) {
    console.error(error)
  }
  finally {
    res.redirect('/member/account/plan')
  }
}
