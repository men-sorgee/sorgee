import { getAdminClient } from '../'

export async function createUserShare(user_id: string, viewer_id: string): Promise<void> {
  const adminClient = await getAdminClient()
  await adminClient.items('user_shares').createOne({
    user_id,
    viewer_id,
  })
}

export async function deleteUserShare(id: string) {
  const adminClient = await getAdminClient()
  await adminClient.items('user_shares').deleteOne(id)
}
