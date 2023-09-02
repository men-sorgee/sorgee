import { SearchableMember, UserView, UserViews } from "lib/models";

import { createItem, readItems, updateItem } from "@directus/sdk";

import { getAdminClient } from "../";

export async function getUserViews(user_id: string): Promise<UserViews> {
  const admin = await getAdminClient()
  const views = await admin.request(readItems('user_views', {
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
    limit: - 1,
    sort: ['-count'],
  }))

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

  const existingItems = await admin.request(readItems('user_views', {

    filter: {
      user_id: {
        _eq: user_id,
      },
      viewed_id: {
        _eq: viewed_id,
      },
    },
    fields: ['id', 'count'],
  }))

  if (existingItems?.length == 0) {
    await admin.request(createItem('user_views', {
      user_id,
      viewed_id,
    }))
  } else {
    await admin.request(updateItem('user_views', existingItems[0].id, {
      count: existingItems[0].count + 1,
    }))
  }
}
