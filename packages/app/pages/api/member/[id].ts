import { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from 'lib/services/directus/server/users'
import { withMethods, withUser } from 'lib/utils/server'
import { Applicant, ApiResponse, MemberLevel, User, memberFields } from 'lib/models'
import { uploadFile, getFileInfo, UploadFolder } from 'lib/services/directus/server'

interface UserUpdate extends Omit<Partial<User>, 'id'> {
  image_field?: string
  image_name?: string
}
export default async function getMemberDetails(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const viewer = await withUser(req, res)

    const { id } = req.query
    let user_id: string
    if (id == 'me') user_id = viewer.id
    else user_id = String(id)
    const viewer_level = MemberLevel[viewer.user_type]

    let user = viewer
    if (user_id !== viewer.id) {
      user = await getUser<User>(user_id, ['*.*', 'my_photos.*', ...memberFields])
      if (!user) {
        return res.status(404).json(ApiResponse(null, 'Not found'))
      }
      const user_level = MemberLevel[user.user_type]

      if (viewer_level < MemberLevel.big_brother && user_level < MemberLevel.brother) {
        return res.status(401).json(ApiResponse(null, 'Unauthorized'))
      }

      if (viewer_level < MemberLevel.staff && user.show_profile == false) {
        return res.status(401).json(ApiResponse(null, 'Unauthorized'))
      }
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
        const updated = await updateUser(user_id, userDetails)
        return res.status(200).json(ApiResponse(updated))
      }
      default:
        return res.status(200).json(ApiResponse(user))
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
