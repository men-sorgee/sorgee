'use client'

export const JsonFetcher = (url: string) => {
  return url
    ? fetch(url)
        .then((r) => r.json())
        .then((r) => r.data)
    : Promise.reject('No URL')
}
