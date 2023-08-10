import { getAdminClient } from "../";

export async function createUserShare(user_id: string, viewer_id: string): Promise<void> {
  const adminClient = await getAdminClient()
  await adminClient.items('user_shares').createOne({
    user_id,
    viewer_id,
  })
}



export async function deleteUserShare(user_id: string, viewer_id: string) {
  const adminClient = await getAdminClient()
  const { data: shares } = await adminClient.items('user_shares').readByQuery({
    filter: {
      viewer_id: {
        _eq: viewer_id,
      },
      user_id: {
        _eq: user_id,
      }
    }
  })
  if (shares.length > 0) {
    await adminClient.items('user_shares').deleteOne(shares[0].id)
  }
}
