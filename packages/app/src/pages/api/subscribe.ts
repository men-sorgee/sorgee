import { ApiResponse, Profile, SubscriptionData, User } from 'lib/models'
import { createUser, findUser, updateUser } from 'lib/services/directus/server'
import { updateSendGrid } from 'lib/services/sendgrid/server'
import { withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

async function Subscribe(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])

    const { name, email } = req.body as SubscriptionData
    let member = await findUser<User>(email)
    if (member) {
      await updateUser(member.id, {
        in_sendgrid: true,
      })
      await updateSendGrid(member as Profile)
    } else {
      member = await createUser({
        first_name: name,
        nickname: name,
        email: email.toLocaleLowerCase(),
        user_type: 'subscriber',
        in_sendgrid: true,
      })
      await updateSendGrid(member as Profile)
    }

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default Subscribe
