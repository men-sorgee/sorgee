import getConfig from "next/config";
import { Directus } from "@directus/sdk";
import { Collections } from "./types";

const adminDb = new Directus<Collections>("https://admin.guysnheat.com");

export async function getAdminClient(): Promise<Directus<Collections>> {
  if (await adminDb.auth.token) return adminDb;
  const token = process.env.ADMIN_TOKEN as string;
  await adminDb.auth.static(token);
  return adminDb;
}

export const cache: { [key: string]: any } = {};
