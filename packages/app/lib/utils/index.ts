import { ApiResponse } from 'lib/models'
import { format } from 'date-fns'

export function toLocaleDate(value: string) {
  const t = new Date()
  const date = new Date(value)
  return date.setMinutes(date.getMinutes() - t.getTimezoneOffset())
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

export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function getJSON<T = never | any>(url: string): Promise<[boolean, ApiResponse<T>]> {
  return await fetchJSON(url)
}

export async function postJSON<T = never | any>(url: string, data: object) {
  return await fetchJSON(url, data, 'POST')
}

export async function putJSON<T = never | any>(url: string, data: object) {
  return await fetchJSON(url, data, 'PUT')
}

export async function fetchJSON<T = never | any>(
  url: string,
  data?: object,
  method: HttpMethod = 'GET',
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
): Promise<[boolean, ApiResponse<T>]> {
  const response = await fetch(url, {
    method,
    headers,
    body: data ? Buffer.from(JSON.stringify(pruneUndefined(data))) : undefined,
  })

  try {
    const body = (await response.json()) as ApiResponse<T>
    return [response.ok, body]
  } catch {
    return [response.ok, { data: null }]
  }
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export function pruneUndefined(obj: Record<string, any>, and: (v: any) => boolean = () => true) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .filter(([_, v]) => and(v))
  )
}

export function getAssetUrl(assetId: string | { id: string }) {
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
