import { User } from "./users";

export type BillingEvent = {
  id: string
  type: string
  data: Record<string, any>
  user?: string | User
  created: number
}

export type MembershipRenewalType = 'month' | 'year'

export type MembershipNames = 'none' | 'free' | 'basic' | 'plus' | 'pro'

export enum MembershipType {
  none = 0,
  free = 1,
  basic = 2,
  plus = 3,
  pro = 4,
}

export type ProductView = {
  id: string
  name: string
  product: string
  description: string
  prices: {
    [key: string]: number
  }
  currency: string
  features: string[]
  type: MembershipNames
  label?: string
}

export type PaymentType = 'stripe' | 'cash'
export type PaymentProductType = 'event' | 'subscription' | 'donation' | 'payment'
export type PaymentStatusType = 'collected' | 'refunded'
export type PaymentCurrencyType = 'usd'
export type UserPayment = {
  id?: string
  user: string | User
  type: PaymentType
  status: PaymentStatusType
  amount: number
  currency: PaymentCurrencyType
  redeemed_id?: string
  product_type: PaymentProductType
  description: string
  notes?: string
  payment_intent?: string
  receipt?: string
  redeemed?: boolean
  date_redeemed?: string
  date_created?: string
};

