import { SearchableMember, UserView, UserViews } from "lib/models";

import { getAdminClient } from "../";

export async function getUserViews(user_id: string): Promise<UserViews> {
  const adminClient = await getAdminClient()
  const { data: views } = await adminClient.items('user_views').readByQuery({
    filter: {
      viewed_id: {
        _eq: user_id,
      },
      user_id: {
        id: { _neq: user_id },
        user_type: {
          _neq: 'staff',
        }
      }
    },
    fields: ['*', 'user_id.*' as any],
    limit: -1,
    sort: ['-count'],
  })

  const myViews: UserViews = {
    count: views.map((v: UserView) => v.count).reduce((a, b) => a + b, 0),
    users: views.map((v: UserView) => {
      return {
        user: v.user_id as unknown as SearchableMember,
        count: v.count,
      }
    })
  }
  return myViews
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
