export type ApiResponse<T = (object & never) | any> = {
  error: ApiError
  data: T
}

export type ApiError = {
  field?: string
  message: string
}

export function ApiResponse<T = any | any>(
  data: T,
  error?: string,
  field?: string & keyof T
): ApiResponse<T> {
  return {
    data: data || ({} as T),
    error: { message: error, field },
  }
}

export type MemberStats = {
  subscribers: number
  applicants: number
  pledges: number
  inductees: number
  brothers: number
  big_brothers: number
  staff: number
}

export * from './billing'
export * from './events'
export * from './users'
export * from './static'
export * from './directus'
export * from './messages'
export * from './surveys'
export * from './notifications'
