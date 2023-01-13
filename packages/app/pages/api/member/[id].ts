import { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from 'lib/services/directus/server/users'
import { withMethods, withMember } from 'lib/utils/server'
import { User, Applicant, ApiResponse } from 'lib/models'
import { uploadFile, getFileInfo, UploadFolder } from '../../../lib/services/directus/server'

interface UserUpdate extends Omit<Partial<User>, 'id'> {
  image_field?: string
  image_name?: string
}
export default async function getUserDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const member = await withMember(req, res)
    if (!member || member.user_type != 'staff') {
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))
    }

    const { id } = req.query
    const user_id = String(id)
    const user = await getUser(user_id)
    if (!user) {
      return res.status(404).json(ApiResponse(null, 'Not found'))
    }

    switch (method) {
      case 'GET':
        return res.status(200).json(ApiResponse(user))

      case 'POST': {
        const { image_field, image_name, ...userDetails } = req.body as UserUpdate
        if (image_field) {
          await getFileInfo(req)
            .then((fileInfo) =>
              uploadFile(fileInfo, UploadFolder.verification, image_name || user.email)
            )
            .then((file) =>
              updateUser(user_id, {
                [image_field]: file.id,
              })
            )
            .catch((e) => console.error(e.message || e, e.stack))
        }
        await updateUser(user_id, userDetails)
        return res.status(200).json(ApiResponse(null))
      }
      default:
        return res.status(200).end()
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
