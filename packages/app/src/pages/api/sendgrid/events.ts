import { UserEmailEvents } from "lib/services/db/entities";
import {
  findUserId,
  storeEmailEvents,
  updateEmailEvent,
  updateNotificationUser
} from "lib/services/db/server";
import { ApiResponse, ApiResponseType } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

import { uuidv4 } from "../../../lib/utils";

type SendGridEvent = {
  sg_event_id: string
  sg_message_id: string
  email: string
  event: string
  category: string | string[]
  marketing_campaign_id?: string
  marketing_campaign_name?: string
  url?: string
  response?: string
  status?: string
  type?: string
  timestamp: number
  notification_id?: number
}



export default async function HandleEvents(req: NextApiRequest, res: NextApiResponse<ApiResponseType>) {
  const emailMap = new Map<string, string>()
  const statesWeCareAbout = ['delivered', 'open', 'click']
  try {
    const events: SendGridEvent[] = req.body


    try {
      const transformed: Omit<UserEmailEvents, 'id' | 'date_created' | 'date_updated'>[] = await Promise.all(
        events.map(async (sgEvent) => {
          const {

            category,
            ...event
          } = sgEvent

          return {
            id: uuidv4(),
            ...event,
            category: Array.isArray(category) ? category.join(',') : category,
          } as Omit<UserEmailEvents, 'date_created' | 'date_updated'>
        })
      )
      let saved = await storeEmailEvents(transformed)
      for await (const { id, notification_id, event, email } of saved) {
        if (notification_id && statesWeCareAbout.includes(event)) {
          try {
            await updateNotificationUser(notification_id, {
              status: event
            })
          } catch (e) {
            console.error('unable to update notification status:', e)
          }
        }
        if (email) {
          try {
            if (!emailMap.has(email)) {
              emailMap.set(email, (await findUserId(email)) || null)
            }
            let user = emailMap.get(email)
            updateEmailEvent(id, { user })
          } catch (e) {
            console.error('unable to append user data:', e)
          }
        }
      }
    } catch (e) {
      console.error(e)
    }

    res.status(200).send(ApiResponse({ success: true }))
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}
