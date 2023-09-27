import { GNHSchema, MemberAlert } from "lib/models";

import {
  createItem,
  deleteItem,
  readItem,
  readItems,
  RestClient,
  updateItem
} from "@directus/sdk";

import { getAdminClient } from "./";

// Alerts

export async function getAlert(id: string): Promise<MemberAlert> {
  const admin = getAdminClient() as RestClient<GNHSchema>
  let alert = await admin.request<MemberAlert>(readItem('user_notification', id))
  if (alert && alert.icon == null)
    alert.icon = 'info'
  return alert
}

export async function getAlerts(user_id: string): Promise<MemberAlert[]> {
  const admin = getAdminClient()
  const data = await admin.request<MemberAlert[]>(readItems('user_notification', {
    filter: {
      user_id: {
        _eq: user_id,
      }
    },
    sort: ['-date_created'],
    fields: ['*'],
    limit: 20
  }))

  let notifications = data as MemberAlert[]
  notifications.forEach((alert) => {
    if (alert.icon == null)
      alert.icon = 'info'
  })
  return notifications
}
export async function deleteAlert(id: string): Promise<void> {
  const admin = getAdminClient()
  admin.request(deleteItem('user_notification', id))
}

export async function markAlertRead(id: string): Promise<MemberAlert> {
  const admin = getAdminClient()
  return admin.request<MemberAlert>(updateItem('user_notification', id, { read: true }))
}

export async function addAlert(user_id: string, notification: Partial<MemberAlert>): Promise<MemberAlert> {
  const admin = getAdminClient()
  return admin.request<MemberAlert>(createItem('user_notification', {
    user_id,
    icon: 'info',
    ...notification,
  }))
}
