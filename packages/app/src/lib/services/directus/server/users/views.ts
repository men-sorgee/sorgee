import { getAdminClient } from ".."
import { UserView } from "lib/models"


export async function getUserViews(user_id: string): Promise<UserView[]> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('user_views').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      }
    },
    fields: ['*'],
    sort: ['-date_created'],
  })
  return data as UserView[]
}

export async function addUserView(user_id: string, viewed_id: string): Promise<void> {
  const admin = await getAdminClient()

  const { data: existingItems } = await admin.items('user_views').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      viewed_id: {
        _eq: viewed_id,
      },
    },
    fields: ['id', 'count'],
  })

  if (existingItems?.length == 0) {
    await admin.items('user_views').createOne({
      user_id,
      viewed_id,
    })
  } else {
    await admin.items('user_views').updateOne(existingItems[0].id, {
      count: existingItems[0].count + 1,
    })
  }
}
