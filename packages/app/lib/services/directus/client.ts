import { Directus } from '@directus/sdk';
import { adminToken } from '../../config';
import { adminBaseUrl } from '../../constants';
import { Collections } from './types';

export const adminDb = new Directus<Collections>(adminBaseUrl);
export { adminToken, adminBaseUrl };
export async function getAdminClient(): Promise<Directus<Collections>> {
  if (await adminDb.auth.token) return adminDb;
  await adminDb.auth.static(adminToken);
  return adminDb;
}
