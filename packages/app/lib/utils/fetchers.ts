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

export const authenticatedFetcher = (authenticated: boolean) => {
  if (!authenticated) return () => Promise.resolve(null)
  return JsonFetcher
}
