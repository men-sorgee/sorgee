import { ApiResponse } from 'lib/models'
import {
  deleteUserPhoto,
  getUserPhoto,
  updateUserPhoto,
} from 'lib/services/directus/server/users/photos'
import {
  withMethods,
  withUser,
} from 'lib/utils/server'
import {
  NextApiRequest,
  NextApiResponse,
} from 'next'

export default async function MemberImage(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST', 'DELETE'])
    const member = await withUser(req, res)

    if (!member) {
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))
    }
    const { id } = req.query
    const photoId = String(id)

    switch (req.method) {
      case 'POST': {
        const { sort, is_public } = req.body
        const userPhoto = await getUserPhoto(photoId)
        if (!userPhoto || userPhoto.users_id != member.id) {
          return res.status(404).json(ApiResponse(null, 'Not Found'))
        }
        await updateUserPhoto(photoId, {
          sort: sort ? Number(sort) : userPhoto.sort,
          is_public: is_public ? Boolean(is_public) : userPhoto.is_public,
        })
        break
      }
      case 'DELETE': {
        const userPhoto = await getUserPhoto(photoId)
        if (!userPhoto || userPhoto.users_id != member.id) {
          return res.status(404).json(ApiResponse(null, 'Not Found'))
        }
        await deleteUserPhoto(photoId)
        break
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
