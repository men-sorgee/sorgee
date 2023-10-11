import { InviteLink } from "lib/models";
import { createUser, findUser, updateUser } from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";
import { sendNotificationEmail } from "../../../lib/services/sendgrid/server";
import { baseUrl } from "../../../lib/config";
import { aP } from "@directus/sdk/dist/index-5c47c85c";



async function Invite(req: NextApiRequest, res: NextApiResponse<ApiResponseType>) {
  try {
    withMethods(req, ['POST'])
    const member = await withMember(req, res)
    const { email } = req.body

    const data = Buffer.from(JSON.stringify({ e: email, v: member?.id })).toString('base64')
    const link = `${baseUrl}/api/auth/signin/email?email=${email}&callbackUrl=${baseUrl}/apply/${data}`

    const existingUser = await findUser(email.toLocaleLowerCase())
    if (existingUser) {
      switch (existingUser.user_type) {
        case 'subscriber': {
          await updateUser(existingUser.id, {
            user_type: 'applicant',
            vouched_by: member.id,
            notes: `Invited by ${member.first_name} ${member.last_name}`,
            application_status: 'apply',
          })
          break
        }
        case 'applicant': {
          await updateUser(existingUser.id, {
            vouched_by: member.id,
            notes: `Invited by ${member.first_name} ${member.last_name}`,
          })
          break
        }
        default: {
          throw new Error('User already exists')
        }
      }
    } else {
      await createUser({
        email: email.toLocaleLowerCase(),
        user_type: 'applicant',
        status: 'active',
        vouched_by: member.id,
        notes: `Invited by ${member.first_name} ${member.last_name}`,
        application_status: 'apply',
      })
    }

    await sendNotificationEmail(
      email,
      `${member.first_name}'s Friend`,
      `${member.first_name} ${member.last_name} has invited you to join our community!`,
      `Begin your application, by clicking the button below.`,
      {
        button_text: `Accept Invitation`,
        button_url: link,
      }
    )

    res.status(200).json(ApiResponse({ link }))

  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Invite
