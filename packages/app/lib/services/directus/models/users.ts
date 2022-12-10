import { string } from 'yargs';
import { Applicant, applicantFields, Member, memberFields } from '..';
import { getAdminClient } from '../client';
import { User, UserEmailEvent } from '../types';
import { listUserInvites } from './events';

export async function createUser(member: Partial<User>): Promise<any> {
  const adminClient = await getAdminClient();
  return adminClient.items('users').createOne(member, {
    fields: Object.keys(member)
  });
}

export async function updateUser(
  id: string,
  member: Partial<User>
): Promise<User | null> {
  const adminClient = await getAdminClient();
  return adminClient.items('users').updateOne(id!, member, {
    fields: Object.keys(member)
  });
}

export async function recordUserLogin(id: string) {
  const adminClient = await getAdminClient();
  return await adminClient.items('users').updateOne(id, {
    last_login: new Date().toISOString()
  });
}

export async function getUser(id: string): Promise<User | null> {
  const adminClient = await getAdminClient();
  const user: any = await adminClient.items('users').readOne(id);
  if (!user) return null;

  const notifications = await getNotifications(user);

  return {
    ...user,
    notifications
  };
}

export async function findUser<T = Applicant>(
  email: string,
  fields = applicantFields
): Promise<T | null> {
  const adminClient = await getAdminClient();
  const existingUserQuery = await adminClient.items('users').readByQuery({
    filter: { email },
    fields: [...(fields as any)]
  });

  const user = existingUserQuery?.data ? existingUserQuery.data[0] : null;

  if (!user) return null;

  const notifications = await getNotifications(user);

  return {
    ...user,
    notifications
  };

  return;
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  const adminClient = await getAdminClient();
  const member: Applicant = await adminClient
    .items('users')
    .readOne(id, { fields: [...applicantFields] });
  return member || null;
}

export async function getMember(id: string): Promise<Member | null> {
  const adminClient = await getAdminClient();
  const member: Member = await adminClient
    .items('users')
    .readOne(id, { fields: [...memberFields] });

  if (!member) return null;

  const notifications = await getNotifications(member);

  return {
    ...member,
    notifications
  } as any;
}

async function getNotifications(member: Member) {
  const adminClient = await getAdminClient();
  const { data: notificationsRaw } = await adminClient
    .items('notifications_users')
    .readByQuery({
      filter: {
        user_id: { _eq: member.id }
      },
      fields: '*,notification_id.*'
    });

  const notifications = notificationsRaw.map((n) => {
    delete n.notification_id.users;
    return {
      id: n.id,
      type: 'message',
      message: n.notification_id.message,
      link: n.notification_id.link,
      status: n.status
    };
  });

  const invites = await listUserInvites(member.id);
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

export async function deleteNotification(id: number) {
  const adminClient = await getAdminClient();
  return await adminClient.items('notifications_users').deleteOne(id);
}

const userEmails = new Map<string, string>();
async function getUserId(email: string) {
  if (userEmails.has(email)) return userEmails.get(email);

  const adminClient = await getAdminClient();
  const { data: users } = await adminClient.items('users').readByQuery({
    filter: { email: { _eq: email } },
    fields: 'id'
  });

  if (users && users.length > 0) {
    userEmails.set(email, users[0].id);
    return users[0].id;
  }
  return null;
}

export async function storeEmailEvent(event: UserEmailEvent) {
  const adminClient = await getAdminClient();
  event.user = (await getUserId(event.email)) || null;
  event.payload = event;
  return await adminClient.items('email_events').createOne(event);
}
