import { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from 'lib/services/directus/server/users'
import { withMember, withMethods } from 'lib/utils/server'
import {
  Applicant,
  ApiResponse,
  User,
  MemberLevel,
  memberFields,
  Member,
  memberProfileContactFields,
  memberProfileExplicitFields,
  memberProfileExplicitRolesFields,
  memberProfileLocationFields,
  memberInterestsFields,
  memberProfileHealthFields,
  memberEventFields,
  memberProfilePrivateFields,
  searchableMemberFields,
  memberProfilePhotoFields,
  UserRelationship,
} from 'lib/models'
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
    const viewer = await withMember(req, res)
    const level = MemberLevel[viewer.user_type]

    const { id } = req.query
    let user_id: string
    if (id == 'me') user_id = viewer.id
    else user_id = String(id)

    let fields = ['users.*', ...searchableMemberFields]
    if (viewer.id == user_id) {
      fields = memberFields
    }

    let user = await getUser<Member>(user_id, fields)
    if (!user) {
      return res.status(404).json(ApiResponse(null, 'Not found'))
    }

    if (level < MemberLevel.staff && user_id !== viewer.id) {
      if (!user.show_profile) {
        return res.status(404).json(ApiResponse(null, 'Not found'))
      }
      filter(user)
      user.my_photos = user.my_photos.filter((p) => p.is_public)

      delete user.users
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
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null, e))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

function filter(member: Member) {
  filterFields(member, memberProfilePrivateFields)
  if (!member.show_photos) {
    filterFields(member, memberProfilePhotoFields)
  }
  if (!member.show_contact) {
    filterFields(member, memberProfileContactFields)
  }
  if (!member.show_explicit) {
    filterFields(member, memberProfileExplicitFields)
  }
  if (!member.show_explicit_roles) {
    filterFields(member, memberProfileExplicitRolesFields)
  }
  if (!member.show_location) {
    filterFields(member, memberProfileLocationFields)
  }
  if (!member.show_interests) {
    filterFields(member, memberInterestsFields)
  }
  if (!member.show_health) {
    filterFields(member, memberProfileHealthFields)
  }
  if (!member.show_events) {
    filterFields(member, memberEventFields)
  }
}

function filterFields(member: Member, fieldList: Array<keyof Member>) {
  fieldList.forEach((field) => {
    delete member[field]
  })
}
