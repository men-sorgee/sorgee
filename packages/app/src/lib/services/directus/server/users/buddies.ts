import { UserBuddy } from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

export async function getBuddy(user_id: string, buddy_id: string): Promise<UserBuddy> {
  const adminClient = await getAdminClient()
  const { data: buddies } = await adminClient.items('user_buddy').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      buddy_id: {
        _eq: buddy_id,
      },
    },
    fields: '*, buddy_id.*' as any,
  })
  if (buddies.length) {
    return buddies[0] as UserBuddy
  }
  return null
}

export async function addBuddy(user_id: string, buddy_id: string): Promise<UserBuddy> {
  const admin = await getAdminClient()
  const relationship = await getBuddy(user_id, buddy_id)

  if (relationship) {
    return relationship
  } else {
    const buddy = await admin.items('user_buddy').createOne({
      user_id,
      buddy_id,
    })
    return buddy as UserBuddy
  }
}

export async function removeBuddy(user_id: string, buddy_id: string) {
  const admin = await getAdminClient()
  const relation = await getBuddy(user_id, buddy_id)

  if (relation) {
    return admin.items('user_buddy').deleteOne(relation.id)
  }
}
