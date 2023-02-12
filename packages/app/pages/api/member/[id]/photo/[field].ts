import { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from 'lib/services/directus/server/users'
import { withMethods, withUser } from 'lib/utils/server'
import { Applicant, ApiResponse, MemberLevel } from 'lib/models'
import { uploadFile, getFileInfo, UploadFolder } from 'lib/services/directus/server'
import { addUserPhoto } from '../../../../../lib/services/directus/server/users/photos'

export default async function MemberImage(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    withMethods(req, ['POST', 'GET'])
    const member = await withUser(req, res)

    const { id, field, name, sort, description } = req.query
    const image_field = field ? String(field) : 'public'
    const image_name = String(name)
    const image_description = String(description || '')

    if (!member) {
      return res.status(401).end('Unauthorized')
    }
    const user_id = String(id || member.id)

    if (member.id != user_id && MemberLevel[member.user_type] <= MemberLevel.staff) {
      return res.status(401).end('Unauthorized')
    }

    const user = await getUser(user_id)
    if (!user) {
      res.status(404).end('Not found')
    }

    const fileInfo = await getFileInfo(req)
    const file = await uploadFile(fileInfo, UploadFolder.profiles, image_name, image_description)

    if (['public', 'private'].includes(image_field)) {
      await addUserPhoto({
        users_id: user_id,
        directus_files_id: file.id,
        is_public: image_field == 'public' ? true : false,
        sort: sort ? Number(sort) : 0,
        status: 'new',
      })
    } else {
      await updateUser(user_id, { [image_field]: file.id })
    }

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
