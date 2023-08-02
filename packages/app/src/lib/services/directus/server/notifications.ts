import {
  AppNotification,
  AppNotificationStatusType,
  NotificationUser,
  Notification,
  UserNotification,
  GroupEvent,
  EventDetail,
  UserType,
} from 'lib/models'
import { notifications } from 'lib/config'
import { getAdminClient } from './'
import { sendAdminNotification } from '../../webhooks/directus'


export async function getAppNotification(id: string): Promise<Notification> {
  const adminClient = await getAdminClient()
  return (await adminClient.items('notifications').readOne(id)) as unknown as Notification
}

export async function createAppNotification(notification: Partial<Notification>) {
  const admin = await getAdminClient()
  return admin.items('notifications').createOne(notification)
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
      date_created,
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
      category,
      read: userNotification.read,
      date_created
    } as AppNotification
  })
  return notifications
}

export async function getAppNotificationUser(id: number) {
  const adminClient = await getAdminClient()
  return adminClient.items('notifications_users').readOne(id)
}

export async function updateAppNotificationUser(id: number, notification: Partial<NotificationUser>) {
  const admin = await getAdminClient()
  return admin.items('notifications_users').updateOne(id, notification)
}

export async function addAppNotificationUser(notificationId: string, userId: string) {
  const admin = await getAdminClient()
  return admin.items('notifications_users').createOne({
    notification_id: notificationId,
    user_id: userId,
    status: 'new',
    read: false,
  })
}

export async function addUserToCongratsEmail(user_id: string, user_type: UserType) {
  // add to congrats email
  const notificationId = notifications.congratsEmail[user_type]
  await addAppNotificationUser(notificationId, user_id)

  try {
    await sendAdminNotification(notificationId)
  } catch (e) {
    console.error(e)
  }
}

export async function createEventSurveyNotification(surveyId: string, event: EventDetail) {
  let template = await getAppNotification(notifications.eventSurvey)
  delete template.id
  template.static = false
  Object.keys(template).forEach((key) => {
    let value = template[key]
    if (typeof value === "string") {
      template[key] = value
        .replaceAll("$EVENT$", event.name)
        .replaceAll("$EVENT_ID$", event.id)
        .replaceAll("$SURVEY_ID$", surveyId)
    }
  })
  template.data = {
    survey_id: surveyId,
  }

  return await createAppNotification(template)
}


// Individual Notifications

export async function getUserNotification(id: string): Promise<UserNotification> {
  const adminClient = await getAdminClient()
  return (await adminClient.items('user_notification').readOne(id)) as unknown as UserNotification
}

export async function getUserNotifications(user_id: string): Promise<UserNotification[]> {
  const adminClient = await getAdminClient()
  const { data: notifications } = await adminClient.items('user_notification').readByQuery({
    filter: {
      user_id: {
        _eq: user_id,
      }
    },
    sort: ['-date_created'],
    fields: '*' as any,
  })

  return notifications as UserNotification[]
}
export async function deleteUserNotification(id: string) {
  const admin = await getAdminClient()
  admin.items('user_notification').deleteOne(id)
}

export async function markUserNotificationRead(id: string) {
  const admin = await getAdminClient()
  return admin.items('user_notification').updateOne(id, { read: true })
}

export async function addUserNotification(user_id: string, notification: Partial<UserNotification>) {
  const admin = await getAdminClient()
  return admin.items('user_notification').createOne({
    user_id,
    ...notification,
  })
}
