import { Membership, User } from './users'

export type BillingEvent = {
  id: string
  type: string
  data: Record<string, any>
  user?: string | User
  created: number
}

export type ProductView = {
  id: string
  name: string
  description: string
  prices: {
    [key: string]: number
  }
  currency: string
  features: string[]
  type: Membership
  label?: string
}
