import { createUser, findUser, updateUser } from 'lib/services/directus/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, SubscriptionData } from 'lib/types';
import { withMethods } from 'lib/services/api';
import { updateSendGrid } from 'lib/services/sendgrid/server';
import { MemberLevel } from '../../../lib/services/directus';

async function Subscribe(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (!withMethods(req, ['POST'])) return;

    const { name, email } = req.body as SubscriptionData;

    const [first, ...remaining] = name.split(' ');
    const last = remaining?.join(' ') || null;

    let member = await findUser(email);
    if (member) {
      await updateUser(member.id, {
        first_name: member.first_name || first,
        last_name: member.last_name || last,
        nickname: member.nickname || name,
        in_sendgrid: true
      });
    } else {
      member = await createUser({
        first_name: first,
        last_name: last,
        nickname: name,
        email,
        user_type: 'subscriber',
        in_sendgrid: true
      });
    }

    await updateSendGrid(
      first,
      last,
      email,
      member.id,
      MemberLevel[member.user_type]
    );

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}

export default Subscribe;
