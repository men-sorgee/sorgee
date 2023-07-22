import { addMinutes, format } from 'date-fns'
import { ApiError, ApiResponse } from 'lib/models'

export function toLocalDate(value: string) {
  return addMinutes(new Date(value), new Date().getTimezoneOffset())
}

export const getUTCNow = () => {
  var now = new Date()
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes() - now.getTimezoneOffset(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )
  )
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  });
}

export function getEventDate(eventStart: string) {
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  let date = new Date(eventStart)
  return {
    day: weekday[date.getDay()],
    short: format(date, 'MMM d'),
    month: format(date, 'MMM'),
    dateOnly: format(date, 'yyyy-MM-dd'),
    dayOfMonth: format(date, 'd'),
    date,
    time: format(date, 'p'),
  }
}

export type ApiResult<T = any> = {
  success: boolean
  data?: T
  error?: ApiError
}
export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function getJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url)
}

export async function postJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string,
  data: T
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url, data, 'POST')
}


export async function putJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string,
  data: T
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url, data, 'PUT')
}

type DefaultTo<T, Fallback> = T extends null | undefined ? Fallback : T

export async function deleteJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string,
  data?: T
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url, data, 'DELETE')
}

export async function fetchJSON<T = object | any, R = DefaultTo<null, T>>(
  url: string,
  data?: T,
  method: HttpMethod = 'GET',
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
): Promise<ApiResult<R>> {
  const response = await fetch(url, {
    method,
    headers,
    body: data ? Buffer.from(JSON.stringify(pruneUndefined(data))) : undefined,
  })
  const { ok: success } = response
  try {
    const body = (await response.json()) as ApiResponse<R>
    if (!body) {
      return { success, error: { message: 'No response body' } }
    }
    const { data, error } = body
    return { success, data, error } as ApiResult<R>
  } catch (error) {
    return { success, error: { message: error.message || error } }
  }
}

export async function postForm<T = any>(
  url: string,
  withForm: (f: FormData) => void
): Promise<ApiResult<T>> {
  const data = new FormData()
  withForm(data)
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  })
  const { ok: success } = response
  try {
    const body = (await response.json()) as ApiResponse<T>
    if (!body) {
      return { success, error: { message: 'No response body' } }
    }
    const { data, error } = body
    return { success, data, error } as ApiResult<T>
  } catch (error) {
    return { success, error: { message: error.message || error } }
  }
}


export function pruneUndefined<T = Record<string, any>>(
  obj: T,
  and: (v: any) => boolean = () => true
): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .filter(([_, v]) => and(v))
  ) as any as T
}

export function getAssetUrl(assetId: string | { id: string }) {
  if (!assetId) return null
  if (typeof assetId == 'string') return `/api/asset/${assetId}`
  else return `/api/asset/${assetId.id}`
}

export function normalize<T>(params: any): Record<keyof T, string[]> {
  const result = {} as Record<keyof T, string[]>
  Object.keys(pruneUndefined(params)).forEach((key) => {
    if (params[key] === undefined || params[key] === null || params[key] === false) return
    const value = params[key]
    result[key] = Array.isArray(value) ? value : value.includes(',') ? value.split(',') : [value]
  })
  return result
}

export function serialize<T>(params: Record<keyof T, string[]>) {
  const pairs = Object.entries(params).map(([key, value]: [string, string[]]) => [
    key,
    Array.isArray(value) ? value.join(',') : value,
  ]) as [string, string][]
  return pairs.reduce((acc, [key, value]) => {
    return acc + `&${key}=${value}`
  }, '')
}

export * from './fetchers'

export function debouncedPromise<T>(
  func: (...args: any[]) => Promise<T>,
  delay: number
): (...args: any[]) => Promise<T> {
  let timerId: NodeJS.Timeout | null

  return async function debouncedFunc(...args: any[]): Promise<T> {
    if (timerId) {
      clearTimeout(timerId)
    }

    return new Promise((resolve) => {
      timerId = setTimeout(async () => {
        const result = await func(...args)
        resolve(result)
      }, delay)
    })
  }
}
