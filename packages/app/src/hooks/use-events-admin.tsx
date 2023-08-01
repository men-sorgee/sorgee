'use client'
import { GroupEvent } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import useSWR from 'swr'

type EventsResults = {
  events: GroupEvent[]
  error?: Error
  loading: boolean
  reload: () => Promise<GroupEvent[]>
}

export const useEventsAdmin = (): EventsResults => {
  const {
    data: events = [],
    mutate,
    error,
    isLoading
  } = useSWR<GroupEvent[], Error>(`/api/events/admin`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    fallbackData: []
  })

  return {
    events,
    error,
    loading: isLoading,
    reload: () => mutate()
  }
}
