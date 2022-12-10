import { NextApiRequest, NextApiResponse } from 'next';

import { storeEmailEvent } from 'lib/services/directus/server';

import { UserEmailEvent } from 'lib/services/directus/types';
import { withMethods } from '../../../lib/utils/server';
import { ApiResponse } from '../../../models';

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

export default async function HandleEvents(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    withMethods(req, ['POST']);

    const events: SendGridEvent[] = req.body;
    await Promise.all(
      events.map((event) => storeEmailEvent(event as UserEmailEvent))
    );

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}
