import { getAdminClient, listUserInvites } from '../';
import { UserNotification, Notification } from 'lib/models';

export async function getNotifications(user_id: string) {
  const adminClient = await getAdminClient();
  const { data: notificationsRaw } = await adminClient
    .items('notifications_users')
    .readByQuery({
      filter: {
        user_id: {
          _eq: user_id
        }
      },
      fields: '*, notification_id.*' as any
    });

  const notifications = notificationsRaw.map((n: UserNotification) => {
    const notification: Notification = n.notification_id as Notification;
    return {
      id: n.id,
      type: 'message',
      message: notification.message,
      link: notification.link,
      status: n.status
    };
  });
  const invites = await listUserInvites(user_id);
  if (invites && invites.length > 0) {
    invites
      .filter((i) => i.rsvp === 'invited')
      .forEach((event) => {
        notifications.push({
          id: null,
          type: 'event',
          message: `You have been invited to ${event.name}`,
          link: `/member/events`,
          status: 'new'
        });
      });
  }
  return notifications;
}

export async function markNotificationSent(id: string) {
  const admin = await getAdminClient();
  admin.items('notifications').updateOne(id, { status: 'sent' });
}

export async function deleteNotification(id: number) {
  const adminClient = await getAdminClient();
  return await adminClient.items('notifications_users').deleteOne(id);
}
