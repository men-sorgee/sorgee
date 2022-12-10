import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/lib/types';
import { withMethods } from 'lib/services/api';
import { updateSendGrid } from 'lib/services/sendgrid/server';
import { getUser, updateUser } from 'lib/services/directus/server';
import { MemberLevel } from '../../../lib/services/directus';
import { adminToken } from '../../../lib/config';

async function AddContact(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

    // if (req.query.token !== adminToken)
    // return res.status(401).json(ApiResponse(null, 'Unauthorized'));

    const { id } = req.body;

    const user = await getUser(id);
    if (!user) return res.status(404).json(ApiResponse(null, 'User not found'));

    const { first_name, last_name, email, user_type } = user;
    await updateSendGrid(
      first_name,
      last_name,
      email,
      id,
      MemberLevel[user_type]
    );
    user.in_sendgrid = true;
    await updateUser(id, user);

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}

export default AddContact;
