'use client'
import { JsonFetcher } from "lib/utils";
import { SWRConfig } from "swr";

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
