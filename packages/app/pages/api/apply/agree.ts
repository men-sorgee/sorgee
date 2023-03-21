import { Profile } from 'lib/models/users'
import { updateUser } from 'lib/services/directus/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { AgreementData, ApiResponse, ApplicationStatus, MemberLevel } from 'lib/models'
import { sendNotificationEmail, updateSendGrid } from 'lib/services/sendgrid/server'
import { withApplicant, withMethods } from 'lib/utils/server'

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])

    const applicant = await withApplicant(req, res)
    const { agree } = req.body as AgreementData
    if (applicant.application_status == 'approved') return res.status(200).end()

    if (applicant && applicant.application_status == 'agreement' && agree) {
      sendNotificationEmail(
        applicant.email,
        applicant.nickname || applicant.first_name + ' ' + applicant.last_name,
        `Application Approved`,
        `Your application is approved. Congratulations, you are now an official pledge of Guys'n Heat! ` +
          `A brother will be reaching out to finalize your onboarding process and if all goes well, invite you to the next event.`,
        {
          button_text: 'Complete Profile',
          button_url: 'https://guysnheat.com/member/profile',
        }
      )

      const user = await updateUser(applicant.id, {
        application_status: 'approved',
        user_type: applicant.vouched_by ? 'inductee' : 'pledge',
        approved_date: new Date().toISOString(),
      })

      //await updateSendGrid(user as Profile)

      return res.status(200).json(ApiResponse(true))
    }
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e?.message || e))
  }
}

export default Agree
