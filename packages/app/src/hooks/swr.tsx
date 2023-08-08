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
        keepPreviousData: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
