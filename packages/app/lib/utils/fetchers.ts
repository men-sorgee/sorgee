'use client'

export async function JsonFetcher<T>(url: string) {
  if (!url) throw new Error('No URL provided')
  const response = await fetch(url)
  const body = await response.json()
  if (!response.ok) {
    if (body.error) throw new Error(body.error)
    throw new Error(response.statusText)
  }
  return body?.data as T
}

export function authenticatedFetcher<T>(authenticated: boolean): (url: string) => Promise<T> {
  if (!authenticated) return () => Promise.resolve(null)
  return (url: string) => JsonFetcher<T>(url)
}
