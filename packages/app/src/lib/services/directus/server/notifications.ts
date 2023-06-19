import {
  AppNotification,
  Notification,
  AppNotificationStatusType,
  NotificationUser,
  UserNotification,
} from 'lib/models'

import { getAdminClient } from './'

export async function getAppNotification(id: string): Promise<Notification> {
  const adminClient = await getAdminClient()
  return (await adminClient.items('notifications').readOne(id)) as unknown as Notification
}

export async function getAppNotifications(user_id: string): Promise<AppNotification[]> {
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

  const notifications = notificationsRaw.map((userNotification: NotificationUser) => {
    const notification: Notification = userNotification.notification_id as Notification

    const {
      subject,
      body,
      message,
      button_url: button_link,
      button_text,
      link,
      category,
    } = notification
    return {
      id: userNotification.id,
      status: userNotification.status,
      subject,
      body,
      message,
      button_url: button_link,
      button_text,
      link,
      category
    } as AppNotification
  })
  return notifications
}

export async function markAppNotification(id: string, status: AppNotificationStatusType) {
  const admin = await getAdminClient()
  admin.items('notifications_users').updateOne(id, { status })
}

export async function markAppNotificationRead(id: string) {
  const admin = await getAdminClient()
  admin.items('notifications_users').updateOne(id, { read: true })
}


// Individual Notifications

export async function getUserNotification(id: string): Promise<UserNotification> {
  const adminClient = await getAdminClient()
  return (await adminClient.items('user_notifications').readOne(id)) as unknown as UserNotification
}

export async function getUserNotifications(user_id: string): Promise<UserNotification[]> {
  const adminClient = await getAdminClient()
  const { data: notifications } = await adminClient.items('user_notifications').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      },
      status: {
        _neq: 'deleted',
      },
    },
    sort: ['-date_created'],
    fields: '*' as any,
  })

  return notifications as UserNotification[]
}
export async function deleteUserNotification(id: string) {
  const admin = await getAdminClient()
  admin.items('user_notifications').deleteOne(id)
}

export async function markUserNotificationRead(id: string) {
  const admin = await getAdminClient()
  await admin.items('user_notifications').updateOne(id, { status: 'read' })
}

export async function addUserNotification(notification: Partial<UserNotification>) {
  const admin = await getAdminClient()
  await admin.items('user_notifications').createOne(notification)
}
