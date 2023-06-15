import { baseUrl } from 'lib/config'
import { Member } from 'lib/models'
import { updateUser } from 'lib/services/directus/server'
import { getClient } from 'lib/services/stripe/server'
import { withMember } from 'lib/utils/server'

const handler = async (req, res) => {
  try {

    let member = await withMember(req, res)
    const stripe = getClient();

    if (!member.customer_id) {
      const { id, email, first_name, last_name } = member;

      const customer = await stripe.customers.create({
        email,
        name: first_name + " " + last_name,
        metadata: {
          userId: id,
        }
      })

      member = await updateUser<Member>(member.id, {
        customer_id: customer.id,
      })
    }

    const { priceId } = req.query;

    const lineItems = [
      {
        price: priceId,
        quantity: 1,
        metadata: {
          userId: member.id,
        }
      },
    ];

    const session = await stripe.checkout.sessions.create({
      customer: member.customer_id,
      mode: "subscription",
      line_items: lineItems,
      success_url: `${baseUrl}/member/plans?message=success`,
      cancel_url: `${baseUrl}/member/plans?message=cancelled`,
      metadata: {
        userId: member.id,
      }
    });

    res.send({
      id: session.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
