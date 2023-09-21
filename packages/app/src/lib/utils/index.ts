import { addMinutes, format } from "date-fns";

export function toLocalDate(value: string) {
  return addMinutes(new Date(value), new Date().getTimezoneOffset())
}

export function getUTCNow() {
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

export function logEvent(action: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

export function gradient(color: string, value: number = 400, step: number = 100) {
  return `linear(to-b, ${color}.${value}, ${color}.${value + step}, ${color}.${value + step})`
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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
    return `/api/asset/${id} `
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
    return acc + `& ${key}=${value} `
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

export type LocationCoordinates = {
  latitude: number
  longitude: number
}

export function getDistance(
  coordinateA: LocationCoordinates,
  coordinateB: LocationCoordinates) {

  const toRad = (x: number) => {
    return (x * Math.PI) / 180;
  }

  var R = 3958.8; // Radius of the earth in miles
  var x1 = coordinateB.latitude - coordinateA.latitude;
  var dLat = toRad(x1);
  var x2 = coordinateB.longitude - coordinateA.longitude;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coordinateA.latitude)) * Math.cos(toRad(coordinateB.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  var miles = d;
  var feet = miles * 5280;

  return { miles: miles, feet: feet };
}

export * from './apis';
export * from './fetchers';

