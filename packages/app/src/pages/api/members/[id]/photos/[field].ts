import {
  Applicant,
  DirectusFile,
  UploadFolder,
  User,
  UserPhoto,
  UserPhotoFieldType
} from "lib/models";
import {
  createFolder,
  findFolder,
  getFileInfo,
  uploadFile
} from "lib/services/directus/server";
import { getUser, updateUser } from "lib/services/directus/server/users";
import { addUserPhoto } from "lib/services/directus/server/users/photos";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withUser
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function MemberImage(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<Applicant> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE', 'GET'])
    const member = await withUser(req, res)

    const { id, field, name, sort, description } = req.query
    const user_id = String(id)
    const image_field: UserPhotoFieldType = field ? (String(field) as UserPhotoFieldType) : 'public'
    const image_name = String(name)
    const image_description = String(description || '')

    if (!member) {
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))
    }

    let user = await getUser(user_id)
    const self = user_id == member.id

    const isPublic = ['picture', 'public'].includes(image_field)

    if (!self) {
      if (!user) {
        res.status(404).json(ApiResponse(null, 'Not Found'))
      }
      if (method != 'GET' && member.user_type != 'staff') {
        return res.status(401).json(ApiResponse(null, 'Unauthorized'))
      }
    }

    switch (method) {
      case 'GET': {
        const image = user[image_field] as DirectusFile
        return image ? res.status(200).redirect('/api/asset/' + image.id) : res.status(404)
      }
      case 'POST': {
        const { private_folder, public_folder } = await getFolders(user)
        const folder = isPublic ? public_folder : private_folder
        const fileInfo = await getFileInfo(req)
        const file = await uploadFile(fileInfo, folder, image_name, image_description)
        const list = user.my_photos as UserPhoto[] || []
        const photoSort = list.filter((p) => p.is_public == isPublic).length + 1

        if (['public', 'private'].includes(image_field)) {
          await addUserPhoto({
            users_id: user_id,
            directus_files_id: file.id,
            is_public: isPublic,
            sort: sort ? Number(sort) : photoSort,
            status: 'new',
          })
        } else {
          await updateUser(user_id, { [image_field]: file.id })
        }
        break
      }

      case 'DELETE': {
        if (['public', 'private'].includes(image_field)) {
          return res.status(405).json(ApiResponse(null, 'Not allowed'))
        }
        await updateUser(user_id, { [image_field]: null })
      }
    }

    return res.status(200).json(ApiResponse('ok'))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getFolders(user: User): Promise<{ private_folder: string; public_folder: string }> {
  let { private_folder, public_folder } = user
  if (private_folder && public_folder) {
    return { private_folder, public_folder }
  } else {
    let userPhotoFolder = await findFolder(user.email, UploadFolder.profiles)
    if (!userPhotoFolder) {
      userPhotoFolder = await createFolder({
        id: user.id,
        name: user.email,
        parent: UploadFolder.profiles,
      })
    }
    if (!private_folder) {
      let privateFolder = await findFolder('private', userPhotoFolder.id)
      if (!privateFolder)
        privateFolder = await createFolder({ name: 'private', parent: userPhotoFolder.id })
      private_folder = privateFolder.id
    }
    if (!public_folder) {
      let publicFolder = await findFolder('public', userPhotoFolder.id)
      if (!publicFolder)
        publicFolder = await createFolder({ name: 'public', parent: userPhotoFolder.id })
      public_folder = publicFolder.id
    }
    await updateUser(user.id, {
      private_folder,
      public_folder,
    })
    return { private_folder, public_folder }
  }
}
