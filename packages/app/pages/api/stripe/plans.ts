import { ApiResponse } from 'lib/models'
import { getSubscriptions } from 'lib/services/stripe/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const subscriptions = getSubscriptions()
    res.json(ApiResponse(subscriptions))
  } catch (error) {
    console.error(error);
    res.redirect(req.headers.referer || "/")
  }
}
