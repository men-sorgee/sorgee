import { adminUrl } from "lib/config";
import { GNHSchema } from "lib/models";

import { DirectusClient, GraphqlClient, RestClient, createDirectus, graphql, rest, staticToken } from "@directus/sdk";

let client: DirectusClient<GNHSchema> & RestClient<GNHSchema> & GraphqlClient<GNHSchema> = null
export function getAdminClient() {
  return client || (client = createDirectus<GNHSchema>(adminUrl)
    .with(staticToken(process.env.ADMIN_TOKEN))
    .with(rest({
      credentials: 'include',
    }))
    .with(graphql({
      credentials: 'include',
    })))
}

export * from './alerts';
export * from './events';
export * from './fields';
export * from './files';
export * from './messages';
export * from './notifications';
export * from './site';
export * from './surveys';
export * from './users';

