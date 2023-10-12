import { MemberFeature, User } from "lib/models";

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

export type PriceView = {
  id: string
  amount: number
  interval: MembershipRenewalType
}

export type ProductView = {
  id: string
  name: string
  description: string
  features: MemberFeature[]
  type: MembershipNames
  label?: string
  prices: PriceView[]

}
export type PaymentType = 'stripe' | 'cash'
export type PaymentProductType = 'event' | 'subscription' | 'donation' | 'payment'
export type PaymentStatusType = 'collected' | 'refunded' | 'uncaptured'
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

export type PurchasePlanDetails = {
  user_id: string
  product_id?: string
  membership_type?: MembershipNames
  membership_start?: string
  membership_end?: string
  amount: number
}


export const MembershipFeatureMap: Record<MemberFeature, string> = {
  view_directory: 'View Directory',
  chat: 'Chat',
  share_photos: 'Share Photos',
  buddy_list: 'Buddy List',
  flirt: 'Flirt',
  view_attendees: 'View Attendees',
  my_views: 'My Views',
  private_events: 'Private Events',
}

export type PlanExtension = {
  enabled?: boolean
  type?: MembershipNames
  features?: Array<MemberFeature>
  label?: string
}

export type PurchaseResponse = {
  id: string
}

export type RefundResponse = {
  paid: boolean
  refunded: boolean
  reason: string
  continue: boolean
}
