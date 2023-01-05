import { getAdminClient } from '..'
import { UserNotification, Notification, AppNotification, NotificationStatus } from '@/lib/models'

export async function getNotifications(user_id: string): Promise<AppNotification[]> {
  const adminClient = await getAdminClient()
  const { data: notificationsRaw } = await adminClient.items('notifications_users').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      status: {
        _neq: 'deleted',
      },
      notification_id: {
        status: {
          _eq: 'ready',
        },
        app_notification: {
          _eq: true,
        },
      },
    },
    sort: ['-id'],
    fields: '*, notification_id.*' as any,
  })

  const notifications = notificationsRaw.map((n: UserNotification) => {
    const notification: Notification = n.notification_id as Notification
    delete notification.users
    delete notification.status
    delete notification.id
    return {
      id: n.id,
      status: n.status,
      subject: notification.subject,
      link: notification.link,
      body: notification.body,
      message: notification.message,
      date_sent: notification.date_sent,
      date_created: notification.date_created,
    } as AppNotification
  })
  return notifications
}

export async function markNotification(id: string, status: NotificationStatus) {
  const admin = await getAdminClient()
  admin.items('notifications_users').updateOne(id, { status })
}
