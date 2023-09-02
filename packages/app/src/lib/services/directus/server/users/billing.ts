import {
  BillingEvent,
  PaymentProductType,
  PaymentStatusType,
  PaymentType,
  User,
  UserPayment
} from "lib/models";

import { createItem, readItem, readItems, updateItem } from "@directus/sdk";

import { getAdminClient } from "../";

export async function saveBillingEvent(event: BillingEvent) {
  const admin = await getAdminClient()
  return await admin.request(createItem('billing_event', event))
}

export async function getBillingEvent(id: string) {
  const admin = await getAdminClient()
  return await admin.request(readItem('billing_event', id))
}

export async function updateBillingEvent(id: string, event: BillingEvent) {
  const admin = await getAdminClient()
  return await admin.request(updateItem('billing_event', id, event))
}

export async function findUserByCustomer(customer: string) {
  const admin = await getAdminClient()
  const data = await admin.request(readItems('users', {
    filter: {
      customer_id: { _eq: customer },
    },
  }))
  return data?.length ? data[0] as unknown as User : null
}

export async function addUserPayment(payment: Partial<UserPayment>) {
  const admin = await getAdminClient()
  let items = await admin.request(readItems('user_payment', {
    filter: {
      id: {
        _eq: payment.payment_intent
      }
    }
  }))
  if (items.length > 0)
    return await admin.request(updateItem('user_payment', payment.id, payment))
  return await admin.request(createItem('user_payment', payment))
}



export async function findUserPayments(
  user_id: string, by?: {
    type?: PaymentType,
    product_type?: PaymentProductType,
    status?: PaymentStatusType
    payment_intent?: string
    redeemed_id?: string
  }) {
  const admin = await getAdminClient()
  const filter = {
    user: { _eq: user_id },
  }
  if (by?.type) filter['type'] = { _eq: by.type }
  if (by?.product_type) filter['product_type'] = { _eq: by.product_type }
  if (by?.status) filter['status'] = { _eq: by.status }
  if (by?.payment_intent) filter['payment_intent'] = { _eq: by.payment_intent }
  if (by?.redeemed_id) filter['redeemed_id'] = { _eq: by.redeemed_id }

  const data = await admin.request(readItems('user_payment', {
    filter,
    sort: ['-date_created'],
  }))

  return data?.length ? data[0] as unknown as UserPayment : null
}

export async function findUserPayment(user_id: string, redeemed_id: string) {
  const admin = await getAdminClient()

  const data = await admin.request(readItems('user_payment', {

    filter: {
      user: { _eq: user_id },
      redeemed_id: { _eq: redeemed_id },
      status: { _eq: 'collected' },
    }
  }))

  return data?.length ? data[0] as unknown as UserPayment : null
}

export async function updateUserPayment(paymentId: string, payment: Partial<UserPayment>) {
  const admin = await getAdminClient()
  return await admin.request(updateItem('user_payment', paymentId, payment))
}
