import { NotificationsUsers, UserEmailEvents } from "lib/db/entities";

import { getRepository } from "./data-source";

export async function storeEmailEvents(events: Omit<UserEmailEvents, 'id' | 'date_created' | 'date_updated'>[]): Promise<UserEmailEvents[]> {
  const repo = await getRepository(UserEmailEvents)
  return repo.save(events) as Promise<UserEmailEvents[]>
}

export async function updateEmailEvent(id: string, event: Partial<UserEmailEvents>) {
  const repo = await getRepository(UserEmailEvents)
  return repo.update({ id }, event)
}

export async function updateNotificationUser(notificationId: number, notificationUser: Partial<NotificationsUsers>) {
  const repo = await getRepository(NotificationsUsers)
  return repo.update(notificationId, notificationUser)
}

