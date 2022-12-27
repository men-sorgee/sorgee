// Service Calls ------------------------------------

import { getAdminClient } from '.';

export async function getEvent(id: string) {
  const client = await getAdminClient();
  const event = await client.items('events').readOne(id);
  return event;
}

export async function getEventInvite(inviteId: number) {
  const client = await getAdminClient();
  const query = await client.items('events_users').readOne(inviteId);

  return query;
}
