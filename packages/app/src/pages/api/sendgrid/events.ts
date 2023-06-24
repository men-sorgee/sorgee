import { ApiResponse, AppNotificationStatusType, UserEmailEvent } from 'lib/models'
import { markAppNotificationUser, storeEmailEvent } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'

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
  notification_id?: string
}

export default async function HandleEvents(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const events: SendGridEvent[] = req.body
    await Promise.all(
      events.map(async (sgEvent) => {
        const {
          sg_event_id,
          sg_message_id,
          email,
          event,
          category,
          marketing_campaign_id,
          marketing_campaign_name,
          url,
          response,
          status,
          type,
          timestamp,
          notification_id,
        } = sgEvent
        const model: UserEmailEvent = {
          sg_event_id,
          sg_message_id,
          email,
          event,
          category: Array.isArray(category) ? category.join(',') : category,
          marketing_campaign_id,
          marketing_campaign_name,
          url,
          response,
          status,
          type,
          timestamp,
          payload: sgEvent,
          notification_id,
        }
        await storeEmailEvent(model)
        const statesWeCareAbout = ['delivered', 'open', 'click']
        if (notification_id && statesWeCareAbout.includes(event))
          await markAppNotificationUser(notification_id, event as AppNotificationStatusType)
      })
    )

    res.status(200).send(ApiResponse({ success: true }))
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}
