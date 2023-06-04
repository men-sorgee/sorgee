import { getAdminClient } from '..'
import { UserBillingEvent } from 'lib/models'

export async function saveUserBillingEvent(event: UserBillingEvent) {
  const admin = await getAdminClient()
  return await admin.items('user_billing_events').createOne(event)
}
