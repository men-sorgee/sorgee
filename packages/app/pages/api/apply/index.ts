import { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from 'lib/services/directus/server'
import { ApiResponse, User, Applicant } from 'lib/models'
import { withAuthUser, withMethods } from 'lib/utils/server'

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])
    const user = await withAuthUser(req, res)
    if (!user) throw new Error('Unauthorized')

    const userDetails = req.body as Applicant & Partial<User>
    userDetails.email = user.email
    userDetails.user_type = 'applicant'
    if (userDetails?.invite) {
      const { v: vid, t: user_type } = userDetails.invite

      const vouchingUser = await getUser(vid)
      if (vouchingUser?.status === 'active') {
        userDetails.vouched_by = vid
        if (user_type && vouchingUser.user_type == 'staff') {
          userDetails.user_type = user_type as any
        }
      }
      delete userDetails.invite
    }

    userDetails.id = user.id
    userDetails.in_sendgrid = true
    userDetails.application_status = 'verify'

    await updateUser(user.id!, userDetails as User)
  } catch (e: any) {
    console.error(e)
    res.status(400).json(ApiResponse(null, e.message || e))
  }

  res.status(200).end()
}

export default Apply
