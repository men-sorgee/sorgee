import { ApiError, ApiResponse } from 'lib/models'
import { format, addMinutes } from 'date-fns'

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

export function getEventDate(eventStart: string) {
  let date = new Date(eventStart)
  return {
    day: format(date, 'dddd'),
    short: format(date, 'MMM d'),
    month: format(date, 'MMM'),
    date: format(date, 'd'),
    time: format(date, 'h:mm a'),
  }
}

export type ApiResult<T = any> = {
  success: boolean
  data?: T
  error?: ApiError
}
export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function getJSON<T = never | any>(url: string): Promise<ApiResult<T>> {
  return await fetchJSON<T>(url)
}

export async function postJSON<T = never | any>(url: string, data: T): Promise<ApiResult<T>> {
  return await fetchJSON<T>(url, data, 'POST')
}

export async function putJSON<T = never | any>(url: string, data: T): Promise<ApiResult<T>> {
  return await fetchJSON<T>(url, data, 'PUT')
}

export async function deleteJSON<T = never | any>(url: string, data?: T): Promise<ApiResult<T>> {
  return await fetchJSON<T>(url, data, 'DELETE')
}

export async function fetchJSON<T = object | any>(
  url: string,
  data?: T,
  method: HttpMethod = 'GET',
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
): Promise<ApiResult<T>> {
  const response = await fetch(url, {
    method,
    headers,
    body: data ? Buffer.from(JSON.stringify(pruneUndefined(data))) : undefined,
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
