'use client'
import useSWR, { KeyedMutator } from 'swr'
import { Site } from 'lib/models'
import { JsonFetcher } from '@/lib/services/fetchers'

type SiteResults = {
  site: Site | null
  error?: any
  mutate: KeyedMutator<Site>
  loading: boolean
  reload: () => void
}

export const useSite = (): SiteResults => {
  const key = `/api/site`
  const {
    data: site,
    mutate,
    error,
    isLoading,
  } = useSWR<Site, Error>(key, JsonFetcher, {
    refreshInterval: 1000 * 60 * 60 * 24, // 24 hours
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
