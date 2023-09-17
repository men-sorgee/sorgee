import { UserLike } from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

export async function getLike(user_id: string, like_id: string): Promise<UserLike> {
  const adminClient = await getAdminClient()
  const { data: buddies } = await adminClient.items('user_like').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      like_id: {
        _eq: like_id,
      },
    },
    fields: '*, like_id.*' as any,
  })
  if (buddies.length) {
    return buddies[0] as UserLike
  }
  return null
}

export async function addLike(user_id: string, like_id: string): Promise<UserLike> {
  const admin = await getAdminClient()
  const relationship = await getLike(user_id, like_id)

  if (relationship) {
    return relationship
  } else {
    const like = await admin.items('user_like').createOne({
      user_id,
      like_id,
    })
    return like as UserLike
  }
}

export async function removeLike(user_id: string, like_id: string) {
  const admin = await getAdminClient()
  const relation = await getLike(user_id, like_id)

  if (relation) {
    return admin.items('user_like').deleteOne(relation.id)
  }
}
