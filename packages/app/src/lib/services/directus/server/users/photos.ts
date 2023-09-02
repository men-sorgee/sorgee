import { UserPhoto } from "lib/models";

import {
  createItem,
  deleteItem,
  readItem,
  readItems,
  updateItem
} from "@directus/sdk";

import { getAdminClient } from "../";

export async function getUserPhotos(userId: string, is_public: boolean = true) {
  const admin = await getAdminClient()
  const photos = await admin.request(readItems('users_photos', {

    filter: {
      users_id: {
        _eq: userId,
      },
      is_public: {
        _eq: is_public,
      },
    },
    sort: ['sort'],
  }))
  return photos
}

export async function getUserPhoto(id: string): Promise<UserPhoto> {
  const admin = await getAdminClient()
  const photo = await admin.request(readItem('users_photos', id))
  return photo as UserPhoto
}

export async function addUserPhoto(photo: UserPhoto) {
  const admin = await getAdminClient()
  const file = await admin.request(createItem('users_photos', photo))
  return file?.id
}

export async function deleteUserPhoto(id: string) {
  const admin = await getAdminClient()
  await admin.request(deleteItem('users_photos', id))
}

export async function updateUserPhoto(id: string, photo: Partial<UserPhoto>) {
  const admin = await getAdminClient()
  await admin.request(updateItem('users_photos', id, photo))
}
