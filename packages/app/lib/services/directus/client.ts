import getConfig from "next/config";
import { Directus } from "@directus/sdk";
import { Collections } from "./types";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const { adminUrl: url } = publicRuntimeConfig;
const { adminToken: token } = serverRuntimeConfig;

//export class AdminDB extends Directus<Collections> {
//  constructor(url: string) {
//    super(url);
//  }
//  get brothers() {
//    return this.items<"users", User>("users");
//  }
//  get locations() {
//    return this.items<"locations", Location>("locations");
//  }
//  get events() {
//    return this.items<"events", Event>("events");
//  }
//}

const adminDb = new Directus<Collections>(url);

export async function getAdminClient(): Promise<Directus<Collections>> {
  if (await adminDb.auth.token) return adminDb;
  if (token) {
    await adminDb.auth.static(token);
  }

  return adminDb;
}
