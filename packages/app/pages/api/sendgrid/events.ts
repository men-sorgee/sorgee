import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/lib/types';
import { withMethods } from 'lib/services/api';
import { updateSendGrid } from 'lib/services/sendgrid/server';
import {
  getUser,
  storeEmailEvent,
  updateUser
} from 'lib/services/directus/server';
import { MemberLevel } from '../../../lib/services/directus';
import { UserEmailEvent } from '../../../lib/services/directus/types';

type SendGridEvent = {
  sg_event_id: string;
  sg_message_id: string;
  email: string;
  event: string;
  category: string | string[];
  marketing_campaign_id?: string;
  marketing_campaign_name?: string;
  url?: string;
  response?: string;
  status?: string;
  type?: string;
  timestamp: number;
};

async function HandleEvents(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    withMethods(req, ['POST']);

    const events: UserEmailEvent[] = req.body;
    await Promise.all(events.map((event) => storeEmailEvent(event)));

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}

export default HandleEvents;
