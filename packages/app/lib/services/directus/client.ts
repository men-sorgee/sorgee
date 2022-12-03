import { Directus } from '@directus/sdk';
import { Collections } from './types';

export const adminBaseUrl =
  process.env.ADMIN_URL || 'https://admin.guysnheat.com';

export const adminDb = new Directus<Collections>(adminBaseUrl);

export async function getAdminClient(): Promise<Directus<Collections>> {
  if (await adminDb.auth.token) return adminDb;
  const token = process.env.ADMIN_TOKEN as string;
  await adminDb.auth.static(token);
  return adminDb;
}
