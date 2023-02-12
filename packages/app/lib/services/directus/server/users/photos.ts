import { getAdminClient } from '..'
import { UserPhoto } from 'lib/models'

export async function getUserPhotos(userId: string, is_public: boolean = true) {
  const adminClient = await getAdminClient()
  const photos = await adminClient.items('users_photos').readByQuery({
    filter: {
      users_id: {
        _eq: userId,
      },
      is_public: {
        _eq: is_public,
      },
    },
  })
  return photos.data
}

export async function addUserPhoto(photo: UserPhoto) {
  const adminClient = await getAdminClient()
  const file = await adminClient.items('users_photos').createOne(photo)
  return file?.id
}
