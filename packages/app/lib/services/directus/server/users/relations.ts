import { getAdminClient } from '..'
import { UserRelationship } from 'lib/models'

export async function getRelationship(
  related_users_id: string,
  users_id: string
): Promise<UserRelationship> {
  const adminClient = await getAdminClient()
  const { data: relation } = await adminClient.items('user_relationships').readByQuery({
    filter: {
      users_id: {
        _eq: users_id,
      },
      related_users_id: {
        _eq: related_users_id,
      },
    },
    fields: '*, related_users_id.*' as any,
  })
  if (relation.length) {
    return relation[0] as UserRelationship
  }
  return null
}

export async function setRelationship(
  related_users_id: string,
  users_id: string,
  relation: 'buddy' | 'block' | 'partner' | 'hottie'
): Promise<UserRelationship> {
  const admin = await getAdminClient()
  const relationship = await getRelationship(users_id, related_users_id)

  let newRelationship = undefined
  if (relationship) {
    newRelationship = admin.items('user_relationships').updateOne(relationship.id, {
      relation,
    })
  } else {
    newRelationship = admin.items('user_relationships').createOne({
      users_id,
      related_users_id,
      relation,
    })
  }

  return newRelationship as UserRelationship
}

export async function removeRelationship(related_users_id: string, users_id: string) {
  const admin = await getAdminClient()
  const relation = await getRelationship(users_id, related_users_id)

  if (relation) {
    return admin.items('user_relationships').deleteOne(relation.id)
  }
}
