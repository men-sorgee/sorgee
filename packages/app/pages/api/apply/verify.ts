import { getFileInfo, updateUser, uploadFile, UploadFolder } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ApplicationStatus } from 'lib/models'
import { withApplicant, withMethods } from 'lib/utils/server'
import { sendNotificationEmail } from 'lib/services/sendgrid/server'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function Verify(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return

    const applicant = await withApplicant(req, res)

    const file = await uploadFile(
      await getFileInfo(req),
      UploadFolder.verification,
      `Verification: ${applicant.id.substring(0, 4)}-${applicant.id.substring(4, 8)}`
    )

    await updateUser(applicant.id, {
      photo: file.id,
      application_status: 'review',
      user_type: 'pledge',
    })

    const status = ApplicationStatus[applicant.application_status]
    if (status < 2)
      await sendNotificationEmail(
        applicant.email,
        applicant.nickname || applicant.first_name + ' ' + applicant.last_name,
        `Application Status`,
        'Your photo ID was submitted. It may take a few days to review.',
        {
          button_text: 'Check Application Results',
          button_url: 'https://guysnheat.com/apply',
        }
      )

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Verify
