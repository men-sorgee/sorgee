import { getAdminClient } from '.'
import { UserNotification, Notification, AppNotification, NotificationStatusType } from 'lib/models'

export async function getNotification(id: string): Promise<Notification> {
  const adminClient = await getAdminClient()
  return await adminClient.items('notifications').readOne(id) as uknown as Notification
}

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

  const notifications = notificationsRaw.map((userNotification: UserNotification) => {
    const notification: Notification = userNotification.notification_id as Notification
    delete notification.users
    delete notification.status
    delete notification.id
    const { subject, body, message, button_url: button_link, button_text, link, category } = notification
    return {
      id: userNotification.id,
      status: userNotification.status,
      subject,
      body,
      message,
      button_url: button_link,
      button_text,
      link,
      category,
    } as AppNotification
  })
  return notifications
}

export async function markNotification(id: string, status: NotificationStatusType) {
  const admin = await getAdminClient()
  admin.items('notifications_users').updateOne(id, { status })
}
