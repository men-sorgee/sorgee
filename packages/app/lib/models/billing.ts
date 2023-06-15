import { User } from './users'

export type BillingEvent = {
  id: string
  type: string
  data: { [key: string]: any, metadata: { [key: string]: any, userId?: string } }
  user?: string | User
  created: number
};




