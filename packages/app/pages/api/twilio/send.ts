import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from 'lib/models'
import { withMethods } from 'lib/utils/server'
import { sendNotification } from 'lib/services/twilio/server'
import { markNotification } from 'lib/services/directus/server'

async function SendNotification(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return

    if (req.headers.authorization !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    const { phone, message, notification_id = null } = req.body

    await sendNotification(phone, message)

    if (notification_id) await markNotification(notification_id, 'sent')

    res.status(200).send(ApiResponse({ success: true }))
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default SendNotification
