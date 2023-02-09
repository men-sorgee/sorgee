'use client'
import { ApiResponse } from 'lib/models'

export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export function toDateTime(secs: number) {
  var t = new Date('1970-01-01T00:30:00Z') // Unix epoch start.
  t.setSeconds(secs)
  return t
}

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
    value.join(','),
  ]) as [string, string][]
  return pairs.reduce((acc, [key, value]) => {
    return acc + `&${key}=${value}`
  }, '')
}

export * from './fetchers'
