import { Applicant } from "lib/models";
import { getUser, updateUser } from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withAuthUser,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

async function Apply(req: NextApiRequest, res: NextApiResponse<ApiResponseType>) {
  try {
    withMethods(req, ['POST'])
    const user = await withAuthUser(req, res)
    if (!user) throw new Error('Unauthorized')

    const userDetails = req.body as Applicant
    userDetails.email = user.email.toLocaleLowerCase()
    userDetails.user_type = 'applicant'
    if (userDetails?.invite) {
      const { v: vid } = userDetails.invite
      const vouchingUser = await getUser(vid)
      if (vouchingUser && vouchingUser?.status === 'active') {
        userDetails.vouched_by = vid
      }
      delete userDetails.invite
    }

    userDetails.id = user.id
    userDetails.in_sendgrid = true
    userDetails.application_status = 'verify'

    await updateUser(user.id!, userDetails)
  } catch (e: any) {
    console.error(e)
    res.status(400).json(ApiResponse(null, e.message || e))
  }

  res.status(200).json(ApiResponse({}))
}

export default Apply
