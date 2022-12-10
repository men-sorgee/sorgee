import { Directus } from '@directus/sdk';

import { adminToken } from 'config/server';
import { adminBaseUrl } from 'config/client';
import { Collections, User } from '../types';

const adminDb = new Directus<Collections>(adminBaseUrl);

export async function getAdminClient(): Promise<Directus<Collections>> {
  if (await adminDb.auth.token) return adminDb;
  await adminDb.auth.static(adminToken);
  return adminDb;
}

const cache: { [key: string]: any } = {};

export async function getFieldOptions<T = User>(
  field: keyof T,
  collection: string = 'users'
) {
  const adminClient = await getAdminClient();

  const key = `${collection}:${String(field)}`;
  if (cache[key]) {
    return cache[key];
  }

  const response: any = await adminClient.fields.readOne(
    collection,
    String(field)
  );

  return response ? (cache[key] = response!.meta!.options.choices) : [];
}

export * from './events';
export * from './files';
export * from './users';
