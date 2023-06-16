import { UserBlock } from 'lib/models'

import { getAdminClient } from '../'

export async function getBlock(user_id: string, blocked_id: string): Promise<UserBlock> {
  const adminClient = await getAdminClient()
  const { data: buddies } = await adminClient.items('user_block').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      blocked_id: {
        _eq: blocked_id,
      },
    },
    fields: '*, blocked_id.*' as any,
  })
  if (buddies.length) {
    return buddies[0] as UserBlock
  }
  return null
}

export async function addBlock(user_id: string, blocked_id: string): Promise<UserBlock> {
  const admin = await getAdminClient()
  const relationship = await getBlock(user_id, blocked_id)

  if (relationship) {
    return relationship
  } else {
    const block = await admin.items('user_block').createOne({
      user_id,
      blocked_id,
    })
    return block as UserBlock
  }
}

export async function removeBlock(user_id: string, blocked_id: string) {
  const admin = await getAdminClient()
  const relation = await getBlock(user_id, blocked_id)

  if (relation) {
    return admin.items('user_block').deleteOne(relation.id)
  }
}
