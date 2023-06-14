import { notifications } from 'lib/config'
import {
  AgreementData,
  ApiResponse,
  Applicant,
  Profile,
} from 'lib/models'
import {
  getNotification,
  getUserEvents,
  updateUser,
} from 'lib/services/directus/server'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
  updateSendGrid,
} from 'lib/services/sendgrid/server'
import {
  withApplicant,
  withMethods,
} from 'lib/utils/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

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
      const userEvents = await getUserEvents(applicant.id)
      const hasAttendedEvent = userEvents.some((e) => e.attended)

      const updatedUser = (await updateUser<Applicant>(applicant.id, {
        application_status: 'approved',
        user_type: hasAttendedEvent ? 'brother' : applicant.vouched_by ? 'inductee' : 'pledge',
        approved_date: new Date().toISOString(),
      })) as Applicant

      await updateSendGrid(updatedUser as Profile)

      if (updatedUser.user_type !== 'pledge') {
        // send congrats email
        const notificationId = updatedUser.user_type === 'brother' ? notifications.congratsBrother : notifications.congratsInductee
        const congratsEmail = await getNotification(notificationId)
        if (congratsEmail == null) throw new Error('Notification not found')

        const { button_text, button_url, subject, body, data, template, category } = congratsEmail
        await sendNotificationEmail(
          updatedUser.email,
          updatedUser.first_name,
          subject.replace('$NAME$', updatedUser.first_name),
          body.replace('$NAME$', updatedUser.first_name),
          {
            ...data,
            button_text,
            button_url,
            user_id: updatedUser.id
          },
          template as SendGridTemplate,
          category as SendGridCategory,
          notificationId
        )
      }

      return res.status(200).json(ApiResponse(updatedUser))
    }
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e?.message || e))
  }
}

export default Agree
