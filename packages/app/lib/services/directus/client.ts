import getConfig from "next/config";
import { Directus } from "@directus/sdk";
import { Collections, Event, EventUser, Location, User } from "./types";
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const { adminUrl: url } = publicRuntimeConfig;
const { adminToken: token } = serverRuntimeConfig;

const directus = new Directus<Collections>(url);

export async function getAdminClient() {
  if (await directus.auth.token) return directus;
  if (token) {
    await directus.auth.static(token);
  }

  return directus;
}

export type { Collections, Event, EventUser, Location, User };
