import { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from 'lib/services/directus/server/users'
import { withMethods, withUser } from 'lib/utils/server'
import { User, Applicant, ApiResponse } from 'lib/models'
import { uploadFile, getFileInfo, UploadFolder } from 'lib/services/directus/server'

export default async function MemberImage(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    withMethods(req, ['POST'])
    const { id, field, name } = req.query
    const image_field = String(field)
    const image_name = String(name)
    const member = await withUser(req, res)

    if (!member) {
      return res.status(401).end('Unauthorized')
    }
    const user_id = String(id || member.id)

    if (member.id != user_id && member.user_type != 'staff') {
      return res.status(401).end('Unauthorized')
    }

    const user = await getUser(user_id)
    if (!user) {
      res.status(404).end('Not found')
    }
    const fileInfo = await getFileInfo(req)
    console.log('user_id', user_id)
    const file = await uploadFile(fileInfo, UploadFolder.members, image_name)
    await updateUser(user_id, { [image_field]: file.id })

    return res.status(200).end('ok')
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).end(e.message || e)
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
}
