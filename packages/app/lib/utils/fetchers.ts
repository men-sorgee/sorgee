import { ApiResponse } from 'lib/models'
;('use client')

/// Fetches a JSON response from the given URL, and returns the data field.
/// This fetcher hides any errors, and returns null if the response is not ok.
export async function JsonFetcher<T>(url: string) {
  if (!url) return null as T
  const response = await fetch(url)
  if (!response.ok) {
    console.log(`Error fetching ${url}: ${response.status} ${response.statusText}`)
    return null as T
  } else {
    try {
      const body = (await response.json()) as ApiResponse<T>
      return body?.data as T
    } catch {
      return null as T
    }
  }
}

export function authenticatedFetcher<T>(authenticated: boolean): (url: string) => Promise<T> {
  if (!authenticated) return () => Promise.resolve(null)
  return (url: string) => JsonFetcher<T>(url)
}
