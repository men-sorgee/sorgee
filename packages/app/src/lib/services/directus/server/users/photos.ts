import { UserPhoto } from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

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
    sort: ['sort'],
  })
  return photos.data
}

export async function getUserPhoto(id: string): Promise<UserPhoto> {
  const adminClient = await getAdminClient()
  const photo = await adminClient.items('users_photos').readOne(id)
  return photo as UserPhoto
}

export async function addUserPhoto(photo: UserPhoto) {
  const adminClient = await getAdminClient()
  const file = await adminClient.items('users_photos').createOne(photo)
  return file?.id
}

export async function deleteUserPhoto(id: string) {
  const adminClient = await getAdminClient()
  await adminClient.items('users_photos').deleteOne(id)
}

export async function updateUserPhoto(id: string, photo: Partial<UserPhoto>) {
  const adminClient = await getAdminClient()
  await adminClient.items('users_photos').updateOne(id, photo)
}
