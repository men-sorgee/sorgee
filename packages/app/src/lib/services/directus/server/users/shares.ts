import { createItem, deleteItem, readItems } from "@directus/sdk";

import { getAdminClient } from "../";
import { UserShare } from "../../../../models";

export async function createUserShare(user_id: string, viewer_id: string): Promise<void> {
  const admin = await getAdminClient()
  await admin.request(createItem('user_shares', {
    user_id,
    viewer_id,
  }))
}



export async function deleteUserShare(user_id: string, viewer_id: string) {
  const admin = await getAdminClient()
  const shares = await admin.request<UserShare[]>(readItems('user_shares', {

    filter: {
      viewer_id: {
        _eq: viewer_id,
      },
      user_id: {
        _eq: user_id,
      }
    }
  }))
  if (shares.length > 0) {
    await admin.request(deleteItem('user_shares', shares[0].id))
  }
}
