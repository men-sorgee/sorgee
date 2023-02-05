import { Profile } from 'lib/models/users'
import { updateUser } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { AgreementData, ApiResponse, ApplicationStatus, MemberLevel } from 'lib/models'
import { sendNotificationEmail, updateSendGrid } from 'lib/services/sendgrid/server'
import { withApplicant, withMethods } from 'lib/utils/server'

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])

    const { agree } = req.body as AgreementData
    const applicant = await withApplicant(req, res)

    if (applicant.application_status == 'approved') return res.status(200).end()

    if (applicant && applicant.application_status == 'agreement' && agree) {
      sendNotificationEmail(
        applicant.email,
        applicant.nickname || applicant.first_name + ' ' + applicant.last_name,
        `Application Status`,
        `Your free membership is now active!`,
        {
          button_text: 'Manage Profile',
          button_url: 'https://guysnheat.com/member/account',
        }
      )

      const user = await updateUser(applicant.id, {
        application_status: 'approved',
        user_type: 'pledge',
      })

      await updateSendGrid(user as Profile)

      return res.status(200).json(ApiResponse(true))
    }
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e?.message || e))
  }
}

export default Agree
