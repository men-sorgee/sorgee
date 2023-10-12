import { Promo } from "lib/models";
import { getAdminClient } from "lib/services/directus/server";

import { readItems } from "@directus/sdk";

export async function findPromo(code: string): Promise<Promo | null> {
  const admin = getAdminClient()
  const data = await admin.request<Promo[]>(readItems('promos', {
    filter: {
      code: { _eq: code },
    },
  }))
  return data?.length ? (data[0] as Promo) : null
}
