import { createUser, findUser, updateUser } from 'lib/services/directus/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, SubscriptionData } from 'lib/types';
import { withMethods } from 'lib/services/api';
import { addSubscriber } from 'lib/services/sendgrid/server';

async function Subscribe(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

    const { name, email } = req.body as SubscriptionData;

    await addSubscriber(name, null, email);

    const member = await findUser(email);

    if (member) {
      await updateUser(member.id, {
        in_sendgrid: true
      });
    } else {
      await createUser({
        first_name: name,
        email,
        user_type: 'subscriber',
        in_sendgrid: true
      });
    }

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(new ApiResponse(e.message || e));
  }
}

export default Subscribe;
