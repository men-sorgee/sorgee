import { UserBuddy } from "lib/models";

import { createItem, deleteItem, readItems } from "@directus/sdk";

import { getAdminClient } from "../";

export async function getBuddy(user_id: string, buddy_id: string): Promise<UserBuddy> {
  const admin = getAdminClient()
  const buddies = await admin.request<UserBuddy[]>(readItems('user_buddy', {

    filter: {
      user_id: {
        _eq: user_id,
      },
      buddy_id: {
        _eq: buddy_id,
      },
    },
    fields: '*, buddy_id.*' as any,
  }))
  if (buddies.length) {
    return buddies[0]
  }
  return null
}

export async function addBuddy(user_id: string, buddy_id: string): Promise<UserBuddy> {
  const admin = getAdminClient()
  const relationship = await getBuddy(user_id, buddy_id)

  if (relationship) {
    return relationship
  } else {
    const buddy = await admin.request<UserBuddy>(createItem('user_buddy', {
      user_id,
      buddy_id,
    }))
    return buddy
  }
}

export async function removeBuddy(user_id: string, buddy_id: string) {
  const admin = getAdminClient()
  const relation = await getBuddy(user_id, buddy_id)

  if (relation) {
    return admin.request(deleteItem('user_buddy', relation.id))
  }
}
