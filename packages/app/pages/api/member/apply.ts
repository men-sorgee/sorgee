import { NextApiRequest, NextApiResponse } from 'next'
import { createUser, getUser, updateUser } from '@/lib/services/directus/server'
import { ApiResponse, User, Applicant, ApplicationStatus, MemberLevel, Profile } from '@/lib/models'
import { updateSendGrid, sendNotificationEmail } from '@/lib/services/sendgrid/server'
import { parseInvite, withApplicant } from 'lib/utils/server'

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const existingUser: Applicant = await withApplicant(req, res)

    let newUser = !existingUser || ApplicationStatus[existingUser.application_status] == 0
    const userDetails = req.body as Applicant & Partial<User>
    if (newUser) {
      if (userDetails?.invite) {
        const { v: vid, t: user_type } = parseInvite(userDetails.invite)
        const vouchingUser = await getUser(vid)
        if (vouchingUser?.status === 'active') {
          userDetails.vouched_by = vid
          if (vouchingUser.user_type == 'staff') {
            userDetails.user_type = user_type as any
          }
        }
        delete userDetails.invite
      }

      await sendNotificationEmail(
        userDetails.email,
        `Application Status`,
        'Thank you for applying for membership!',
        'Complete Application',
        'https://guysnheat.com/apply/resume'
      )
      userDetails.in_sendgrid = true

      userDetails.application_status = 'verify'
      const newUser = await createUser(userDetails as User)
      await updateSendGrid(newUser as Profile)
    } else {
      await updateUser(existingUser.id!, userDetails as User)
      await updateSendGrid(existingUser)
    }
  } catch (e: any) {
    console.error(e)
    res.status(400).json(ApiResponse(null, e.message || e))
  }

  res.status(200).end()
}

export default Apply
