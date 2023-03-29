import {
  deleteFile,
  getFileInfo,
  updateUser,
  uploadFile,
  UploadFolder,
} from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, Applicant, ApplicationStatus, DirectusFile } from 'lib/models'
import { withApplicant, withMethods } from 'lib/utils/server'
import { sendNotificationEmail } from 'lib/services/sendgrid/server'

async function Verify(req: NextApiRequest, res: NextApiResponse<ApiResponse<Applicant>>) {
  try {
    if (!withMethods(req, ['POST'])) return

    const applicant = await withApplicant(req, res)

    let previousPhoto = null
    if (applicant.photo) {
      previousPhoto = applicant.photo as DirectusFile
    }

    const fileInfo = await getFileInfo(req)
    const file = await uploadFile(
      fileInfo,
      UploadFolder.verification,
      `Verification: ${applicant.id.substring(0, 4)}-${applicant.id.substring(4, 8)}`,
      `Verification for ${applicant.email}: ${applicant.first_name} ${applicant.last_name} `
    )

    const updatedUser = (await updateUser(applicant.id, {
      photo: file.id,
      application_status: 'review',
      user_type: 'applicant',
    })) as Applicant

    const status = ApplicationStatus[applicant.application_status]
    if (status == ApplicationStatus.verify && previousPhoto == null)
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

    if (previousPhoto) {
      await deleteFile(previousPhoto.id)
    }

    res.status(200).json(ApiResponse(updatedUser))
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Verify
export const config = {
  api: {
    bodyParser: false,
  },
}
