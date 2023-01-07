'use client'
import useSWR, { KeyedMutator } from 'swr'
import { Site } from 'lib/models'
import { JsonFetcher } from 'lib/services/fetchers'

type SiteResults = {
  site: Site | null
  error?: any
  mutate: KeyedMutator<Site>
  loading: boolean
  reload: () => void
}

export const useSite = (): SiteResults => {
  const {
    data: site,
    mutate,
    error,
    isLoading,
  } = useSWR<Site, Error>(`/api/site`, JsonFetcher, {
    refreshInterval: 1000 * 60 * 60 * 24, // 24 hours]
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    fallbackData: {
      site_title: 'Loading...',
      description: 'Loading...',
      invite_only: true,
    },
  })

  return {
    site,
    error,
    mutate,
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
