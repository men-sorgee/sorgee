import { Applicant, applicantFields, Member, memberFields } from '..';
import { getAdminClient } from '../client';
import { User } from '../types';

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
  return user || null;
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

  return existingUserQuery?.data ? existingUserQuery.data[0] : null;
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
  return member || null;
}
