import { getAdminClient } from '.';

export async function markNotificationSent(id: string) {
  const admin = await getAdminClient();
  admin.items('notifications').updateOne(id, { status: 'sent' });
}
