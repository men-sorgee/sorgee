import config from 'lib/config/server'
import { Profile } from 'lib/models'
import { ApiResponse } from 'lib/utils'
import { getUser, updateUser } from 'lib/services/directus/server'
import { updateSendGrid } from 'lib/services/sendgrid/server'
import { withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

async function SyncContact(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    if (!withMethods(req, ['POST'])) return

    if (req.headers.authorization !== config.adminToken)
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))

    const { id } = req.body

    const user = await getUser(id)
    if (!user) return res.status(404).json(ApiResponse(null, 'User not found'))

    await updateSendGrid(user as Profile)
    user.in_sendgrid = true
    await updateUser(id, user)

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export default SyncContact
