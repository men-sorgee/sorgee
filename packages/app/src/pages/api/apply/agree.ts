import { notifications } from 'lib/config'
import { AgreementData, ApiResponse, Applicant, MemberLevel, Profile, UserType } from 'lib/models'
import { getAppNotification, getUserEvents, updateUser } from 'lib/services/directus/server'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
  updateSendGrid,
} from 'lib/services/sendgrid/server'
import { withApplicant, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])

    const applicant = await withApplicant(req, res)
    const { agree } = req.body as AgreementData
    const { application_status, user_type: current_level } = applicant
    if (application_status == 'approved' || MemberLevel[current_level] > MemberLevel.applicant)
      return res.status(200).end(ApiResponse(applicant))

    if (applicant && application_status == 'agreement' && agree) {

      const userEvents = await getUserEvents(applicant.id)
      const hasAttendedEvent = userEvents.some((e) => e.attended)
      const user_type: UserType = hasAttendedEvent ? 'brother' : (applicant.vouched_by ? 'inductee' : 'pledge')

      const updatedUser = (await updateUser<Applicant>(applicant.id, {
        application_status: 'approved',
        user_type,
        approved_date: new Date().toISOString(),
      })) as Applicant

      await updateSendGrid(updatedUser as Profile)

      sendNotificationEmail(
        applicant.email,
        applicant.nickname || applicant.first_name,
        `Your Application was approved, ${user_type}!`,
        `Your application was verified and approved. You are now an official ${user_type} of Guys'n Heat! `,
        {
          button_text: user_type == 'brother' ? 'Get More Features!' : 'Complete Profile',
          button_url: user_type == 'brother' ? 'https://guysnheat.com/member/subscription' : 'https://guysnheat.com/member/profile',
        },
        SendGridTemplate.Notification,
        SendGridCategory.Notification
      )

      // send congrats email
      const notificationId = notifications.congratsEmail[user_type]
      const congratsEmail = await getAppNotification(notificationId)
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
          user_id: updatedUser.id,
        },
        template as SendGridTemplate,
        category as SendGridCategory,
        notificationId
      )

      return res.status(200).json(ApiResponse(updatedUser))
    }
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e?.message || e))
  }
}

export default Agree
