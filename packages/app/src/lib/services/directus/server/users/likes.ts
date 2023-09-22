import { UserLike } from "lib/models";

import { createItem, readItems, updateItem } from "@directus/sdk";

import { getAdminClient } from "../";

export async function getLike(user_id: string, like_id: string): Promise<UserLike> {
  const admin = getAdminClient()
  const buddies = await admin.request(readItems('user_like', {

    filter: {
      user_id: {
        _eq: user_id,
      },
      like_id: {
        _eq: like_id,
      },
    },
    fields: '*, like_id.*' as any,
  }))
  if (buddies.length) {
    return buddies[0] as UserLike
  }
  return null
}

export async function addLike(user_id: string, like_id: string): Promise<UserLike> {
  const admin = getAdminClient()
  const relationship = await getLike(user_id, like_id)

  if (relationship) {
    return relationship
  } else {
    const like = await admin.request(createItem('user_like', {
      user_id,
      like_id,
    }))
    return like as UserLike
  }
}

export async function removeLike(user_id: string, like_id: string) {
  const admin = getAdminClient()
  const relation = await getLike(user_id, like_id)

  if (relation) {
    return admin.request(updateItem('user_like', relation.id, relation))
  }
}
