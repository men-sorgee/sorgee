import { updateAppNotificationUser } from "lib/services/directus/server";
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail
} from "lib/services/sendgrid/server";
import { ApiResponse, ApiResponseType, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

async function SendNotification(req: NextApiRequest, res: NextApiResponse<ApiResponseType>) {
  try {
    withMethods(req, ['POST'])

    if (req.headers.authorization !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    const {
      email,
      name,
      subject,
      body,
      data,
      template = SendGridTemplate.Notification,
      category = SendGridCategory.Notification,
      notification_id = null,
    } = req.body

    await sendNotificationEmail(
      email,
      name,
      subject,
      body,
      data,
      template,
      category,
      notification_id
    )

    if (notification_id) await updateAppNotificationUser(notification_id, { status: 'sent' })

    res.status(200).send(ApiResponse({ success: true }))
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default SendNotification
