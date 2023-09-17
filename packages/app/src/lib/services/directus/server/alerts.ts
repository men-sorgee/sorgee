import { MemberAlert } from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

// Alerts

export async function getAlert(id: string): Promise<MemberAlert> {
  const adminClient = await getAdminClient()
  let alert = await adminClient.items('user_notification').readOne(id) as MemberAlert
  if (alert && alert.icon == null)
    alert.icon = 'info'
  return alert
}

export async function getAlerts(user_id: string): Promise<MemberAlert[]> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('user_notification').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      }
    },
    sort: ['-date_created'],
    fields: '*' as any,
    limit: 20
  })

  let notifications = data as MemberAlert[]
  notifications.forEach((alert) => {
    if (alert.icon == null)
      alert.icon = 'info'
  })
  return notifications
}
export async function deleteAlert(id: string) {
  const admin = await getAdminClient()
  admin.items('user_notification').deleteOne(id)
}

export async function markAlertRead(id: string) {
  const admin = await getAdminClient()
  return admin.items('user_notification').updateOne(id, { read: true })
}

export async function addAlert(user_id: string, notification: Partial<MemberAlert>) {
  const admin = await getAdminClient()
  return admin.items('user_notification').createOne({
    user_id,
    icon: 'info',
    ...notification,
  })
}
