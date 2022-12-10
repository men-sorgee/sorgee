import { NextApiRequest, NextApiResponse } from 'next';

import { getUser, updateUser } from 'lib/services/directus/server';
import { updateSendGrid } from 'lib/services/sendgrid/server';
import { withMethods } from 'lib/utils/server';
import { ApiResponse, MemberLevel } from 'models';

async function AddContact(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

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
