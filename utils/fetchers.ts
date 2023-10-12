
/// Fetches a JSON response from the given URL, and returns the data field.

import { ApiResponseType } from "./apis";

/// This fetcher hides any errors, and returns null if the response is not ok.
export async function JsonFetcher<T>(url: string) {
  if (!url) return null as T
  const response = await fetch(url)
  if (!response.ok) {
    console.log(`error fetching ${url}: ${response.status} ${response.statusText}`)
    return null as T
  } else {
    try {
      const body = (await response.json()) as ApiResponseType<T>
      return body?.data as T
    } catch {
      return null as T
    }
  }
}
