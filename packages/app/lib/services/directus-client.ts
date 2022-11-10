import getConfig from "next/config";
import { Directus } from "@directus/sdk";
import { DataSchema } from "../directus/types";
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const { adminUrl: url } = publicRuntimeConfig;
const { adminToken: token } = serverRuntimeConfig;

const directus = new Directus<DataSchema>(url);

export async function getDirectusClient() {
  if (await directus.auth.token) return directus;

  if (token) {
    await directus.auth.static(token);
  }

  return directus;
}
