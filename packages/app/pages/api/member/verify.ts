import { updateUser, uploadFile, UploadFolder } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ApplicationStatus } from 'lib/models'
import { withMember, withMethods } from 'lib/utils/server'
import { sendNotificationEmail } from 'lib/services/sendgrid/server'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function Verify(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return

    const member = await withMember(req, res)
    if (!member) return

    const file = await uploadFile(
      req,
      UploadFolder.verification,
      `Verification: ${member.id.substring(0, 4)}-${member.id.substring(4, 8)}`
    )

    const status = ApplicationStatus[member.application_status]
    if (status < 2)
      await sendNotificationEmail(
        member.email,
        member.nickname || member.first_name + ' ' + member.last_name,
        `Application Status`,
        'Your photo ID was submitted. It may take a few days to review.',
        {
          button_text: 'Check Application Results',
          button_url: 'https://guysnheat.com/apply/resume',
        }
      )

    await updateUser(member.id, {
      photo: file.id,
      application_status: 'review',
    })

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Verify
