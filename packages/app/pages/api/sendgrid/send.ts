import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '@/lib/models'
import { withMethods } from 'lib/utils/server'
import { sendNotificationEmail } from 'lib/services/sendgrid/server'
import { markNotificationSent } from 'lib/services/directus/server'

async function SendNotification(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return

    if (req.headers.authorization !== process.env.ADMIN_TOKEN)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    const { email, subject, message, button_text, button_link, template, id } = req.body

    await sendNotificationEmail(email, subject, message, button_text, button_link, template)

    if (id) {
      await markNotificationSent(id)
    }

    res.status(200).send(ApiResponse({ success: true }))
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default SendNotification
