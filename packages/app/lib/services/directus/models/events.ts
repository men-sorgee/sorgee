import { EventInviteRSVPType } from '..';
import { getAdminClient } from '../client';
import { EventUser } from '../types'

export async function getEvent(id: string) {
  const client = await getAdminClient();
  const event = await client.items('events').readOne(id);
  return event;
}

export async function getEventInvite(eventId: string, userId: string) {
  const client = await getAdminClient();
  const query = await client.items('event_invites').readByQuery({
    filter: {
      event: { _eq: eventId },
      user: { _eq: userId }
    }
  });

  return query.data[0] as EventUser;
}

export async function updateEventUserRSVP(
  eventId: string,
  userId: string,
  rsvp: EventInviteRSVPType,
  reason: string
) {
  const client = await getAdminClient();
  const invite = await getEventInvite(eventId, userId);

  if (!invite) {
    throw new Error('No invite found');
  }

  invite.rsvp = rsvp;
  invite.reason = reason;

  client.items('event_invites').updateOne(invite.id, invite);
}
