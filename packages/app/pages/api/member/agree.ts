import { updateUser } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { AgreementData, ApiResponse, ApplicationStatus, MemberLevel } from '@/lib/models'
import { sendNotificationEmail, updateSendGrid } from 'lib/services/sendgrid/server'
import { withApplicant, withMethods } from 'lib/utils/server'

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])

    const { agree } = req.body as AgreementData
    const applicant = await withApplicant(req, res)
    const appStatus = ApplicationStatus[applicant.application_status]

    if (appStatus == ApplicationStatus['approved']) return res.status(200).end()

    if (applicant && appStatus == ApplicationStatus['agreement'] && agree) {
      sendNotificationEmail(
        applicant.email,
        `Application Status`,
        `Your free membership is now active!`,
        'Manage Profile',
        'https://guysnheat.com/member/account'
      )

      await updateUser(applicant.id, {
        application_status: ApplicationStatus[ApplicationStatus.approved],
        user_type: MemberLevel[MemberLevel.member],
      })

      await updateSendGrid(applicant)

      return res.status(200).end()
    }
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e?.message || e))
  }
}

export default Agree
