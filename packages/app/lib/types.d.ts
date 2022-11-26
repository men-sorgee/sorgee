export type FormOptions = Array<{
  text: string;
  value: string;
}>;

export type ApiResponse = {
  message?: string
  error?: { message: string }
}

export type ApiResponse<T> = ApiResponse & {
  data: T | null
}

export type SubscriptionData = {
  name?: string
  email?: string
}

export type AgreementData = {
  agree: boolean
}