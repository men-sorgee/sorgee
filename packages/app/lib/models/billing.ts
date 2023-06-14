import {
  MemberFeature,
  MembershipType,
  User,
} from './users'

export type BillingEvent = {
  id: string
  type: string
  data: { [key: string]: any, metadata: { [key: string]: any, userId?: string } }
  user?: string | User
  created: number
};

export type Subscription = {
  id: string
  name: string
  type: MembershipType
  price: {
    monthly: number
    annualy: number
  }
  description: string
  features: MemberFeature[]
}


