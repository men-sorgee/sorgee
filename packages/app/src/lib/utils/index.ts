import { addMinutes, format } from "date-fns";

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

export function getAssetUrl(asset: string | { id: string }) {
  if (asset == null) return null
  if (typeof asset == 'string')
    return asset.startsWith('/api') ? asset : `/api/asset/${asset}`
  else {
    let { id } = asset
    return `/api/asset/${id}`
  }
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

export * from './fetchers'
export * from './apis'
