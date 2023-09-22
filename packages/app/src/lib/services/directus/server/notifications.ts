import { notifications } from "lib/config";
import {
  EventDetail,
  Notification,
  NotificationUser,
  UserNotification,
  UserType
} from "lib/models";

import { createItem, readItem, readItems, updateItem } from "@directus/sdk";

import { getAdminClient } from "./";

export async function getNotification(id: string): Promise<Notification> {
  const admin = getAdminClient()
  return (await admin.request<Notification>(readItem('notifications', id))) as unknown as Notification
}

export async function createNotification(notification: Partial<Notification>) {
  const admin = getAdminClient()
  return admin.request<Notification>(createItem('notifications', notification))
}


export async function getNotifications(user_id: string): Promise<UserNotification[]> {
  const admin = getAdminClient()
  const notificationsRaw = await admin.request<NotificationUser[]>(readItems('notifications_users', {
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
    limit: 20
  }))

  const notifications = notificationsRaw.map((userNotification: NotificationUser) => {
    const {
      body,
      message,
      button_text,
      button_url,
      subject,
      link,
      data,
      status,
      date_created
    } = userNotification.notification_id as Notification

    return {
      id: userNotification.id,
      status,
      read: userNotification.read,
      body,
      message,
      button_text,
      button_url,
      link,
      subject,
      data,
      date_created
    } as UserNotification
  })
  return notifications
}

export async function getNotificationUser(id: number) {
  const admin = getAdminClient()
  return admin.request<NotificationUser>(readItem('notifications_users', id))
}

export async function updateNotificationUser(id: number, notification: Partial<NotificationUser>) {
  const admin = getAdminClient()
  return admin.request<NotificationUser>(updateItem('notifications_users', id, notification))
}

export async function addNotificationUser(notificationId: string, userId: string) {
  const admin = getAdminClient()
  return admin.request<NotificationUser>(createItem('notifications_users', {
    notification_id: notificationId,
    user_id: userId,
    status: 'new',
    read: false,
  }))
}

export async function addUserToPledgeSurveyEmail(user_id: string) {
  await addNotificationUser(notifications.pledgeSurvey, user_id)
  try {
    //await sendAdminNotification(notifications.pledgeSurvey)
  } catch (e) {
    console.error(e)
  }
}

export async function addUserToCongratsEmail(user_id: string, user_type: UserType) {
  await addNotificationUser(notifications.congratsEmail[user_type], user_id)
  try {
    //await sendAdminNotification(notifications.congratsEmail[user_type])
  } catch (e) {
    console.error(e)
  }
}

export async function createEventSurveyNotification(surveyId: string, event: EventDetail) {
  let template = await getNotification(notifications.eventSurvey)
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

  return await createNotification(template)
}


