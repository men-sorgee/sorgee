import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/lib/types';
import { withMethods } from 'lib/services/api';
import { addSubscriber } from 'lib/services/sendgrid/server';
import { getUser, updateUser } from 'lib/services/directus/server';

async function AddContact(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

    if (req.headers['x-api-key'] !== process.env.ADMIN_TOKEN)
      return res.status(401).json(new ApiResponse('Unauthorized'));

    const { id } = req.body;

    const user = await getUser(id);
    const { first_name, last_name, email } = user;
    await addSubscriber(first_name, last_name, email);
    user.in_sendgrid = true;
    await updateUser(id, user);

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(new ApiResponse(e.message || e));
  }
}

export default AddContact;
