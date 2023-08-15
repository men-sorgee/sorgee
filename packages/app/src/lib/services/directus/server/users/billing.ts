import {
  BillingEvent,
  PaymentProductType,
  PaymentStatusType,
  PaymentType,
  User,
  UserPayment
} from "lib/models";

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
  return data?.length ? data[0] as unknown as User : null
}

export async function addUserPayment(payment: UserPayment) {
  const admin = await getAdminClient()
  return await admin.items('user_payment').createOne(payment)
}



export async function findUserPayments(
  user_id: string, by?: {
    type?: PaymentType,
    product_type?: PaymentProductType,
    status?: PaymentStatusType
    payment_intent: string
  }) {
  const admin = await getAdminClient()
  const filter = {
    user: { _eq: user_id },
  }
  if (by?.type) filter['type'] = { _eq: by.type }
  if (by?.product_type) filter['product_type'] = { _eq: by.product_type }
  if (by?.status) filter['status'] = { _eq: by.status }
  if (by?.payment_intent) filter['payment_intent'] = { _eq: by.payment_intent }

  const { data } = await admin.items('user_payment').readByQuery({
    filter,
    sort: ['-date_created'],
  })

  return data?.length ? data[0] as unknown as UserPayment : null
}

export async function findUserPayment(user_id: string, redeemed_id: string) {
  const admin = await getAdminClient()

  const { data } = await admin.items('user_payment').readByQuery({
    filter: {
      user: { _eq: user_id },
      redeemed_id: { _eq: redeemed_id },
      status: { _eq: 'collected' },
    }
  })

  return data?.length ? data[0] as unknown as UserPayment : null
}

export async function updateUserPayment(paymentId: string, payment: Partial<UserPayment>) {
  const admin = await getAdminClient()
  return await admin.items('user_payment').updateOne(paymentId, payment)
}
