import { User } from './users'

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
