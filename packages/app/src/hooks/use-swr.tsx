'use client'

import { JsonFetcher } from "lib/utils";
import { SWRConfig } from "swr";

export const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: JsonFetcher,
        refreshWhenOffline: true,
        refreshWhenHidden: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        revalidateIfStale: true,
        keepPreviousData: true,
        dedupingInterval: 1000 * 30,
        focusThrottleInterval: 1000 * 10,
      }}

    >
      {children}
    </SWRConfig>
  )
}
