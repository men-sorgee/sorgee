import { baseUrl } from 'lib/config'
import { Member } from 'lib/models'
import { updateUser } from 'lib/services/directus/server'
import { getClient } from 'lib/services/stripe/server'
import { withMember } from 'lib/utils/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let user = await withMember(req, res)

    const stripe = getClient();

    if (user.customer_id == null || user.customer_id == undefined) {
      const { id, email, first_name, last_name } = user;


      const customer = await stripe.customers.create({
        email,
        name: first_name + " " + last_name,
        metadata: {
          userId: id,
        }
      });

      user = await updateUser<Member>(user.id, {
        customer_id: customer.id,
      })
    }


    const session = await stripe.billingPortal.sessions.create({
      customer: user.customer_id,
      return_url: `${baseUrl}/subscription/success`,
    });

    res.redirect(session.url);

  } catch (error) {
    console.error(error);
    res.redirect(req.headers.referer || "/member/account")
  }
}
