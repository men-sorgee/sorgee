import { BillingEvent } from "lib/models";

import { getAdminClient } from "../";

export async function saveBillingEvent(event: BillingEvent) {
  const admin = await getAdminClient()
  return await admin.items('billing_event').createOne(event)
}

export async function getBillingEvent(id: string) {
  const admin = await getAdminClient()
  return await admin.items('billing_event').readOne(id)
}

export async function updateBillingEvent(id: string, event: BillingEvent) {
  const admin = await getAdminClient()
  return await admin.items('billing_event').updateOne(id, event)
}

export async function findUserByCustomer(customer: string) {
  const admin = await getAdminClient()
  const { data } = await admin.items('users').readByQuery({
    filter: {
      customer_id: { _eq: customer },
    },
  })
  return data?.length ? data[0] : null
}
