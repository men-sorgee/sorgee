import { MemberAlert } from "lib/models";

import {
  createItem,
  deleteItem,
  readItem,
  readItems,
  updateItem
} from "@directus/sdk";

import { getAdminClient } from "./";

// Alerts

export async function getAlert(id: string): Promise<MemberAlert> {
  const admin = await getAdminClient()
  let alert = await admin.request(readItem('user_notification', id)) as MemberAlert
  if (alert && alert.icon == null)
    alert.icon = 'info'
  return alert
}

export async function getAlerts(user_id: string): Promise<MemberAlert[]> {
  const admin = await getAdminClient()
  const data = await admin.request(readItems('user_notification', {
    filter: {
      user_id: {
        _eq: user_id,
      }
    },
    sort: ['-date_created'],
    fields: '*' as any,
    limit: 20
  }))

  let notifications = data as MemberAlert[]
  notifications.forEach((alert) => {
    if (alert.icon == null)
      alert.icon = 'info'
  })
  return notifications
}
export async function deleteAlert(id: string) {
  const admin = await getAdminClient()
  admin.request(deleteItem('user_notification', id))
}

export async function markAlertRead(id: string) {
  const admin = await getAdminClient()
  return admin.request(updateItem('user_notification', id, { read: true }))
}

export async function addAlert(user_id: string, notification: Partial<MemberAlert>) {
  const admin = await getAdminClient()
  return admin.request(createItem('user_notification', {
    user_id,
    icon: 'info',
    ...notification,
  }))
}
