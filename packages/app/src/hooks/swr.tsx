'use client'
import { SWRConfig } from 'swr'
import { JsonFetcher } from 'lib/utils'
export const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: JsonFetcher,
        refreshWhenOffline: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        revalidateOnMount: true,
        revalidateIfStale: true,
        dedupingInterval: 10000,
        focusThrottleInterval: 3000,
        keepPreviousData: true
      }}
    >
      {children}
    </SWRConfig>
  )
}
