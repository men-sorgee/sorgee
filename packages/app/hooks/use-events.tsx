'use client'
import { GroupEvent } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import useSWR, { KeyedMutator } from 'swr'

type EventsResults = {
  events: GroupEvent[]
  error?: any
  mutate: KeyedMutator<GroupEvent[]>
  loading: boolean
  reload: () => void
}

export const useEvents = (): EventsResults => {
  const {
    data: events = [],
    mutate,
    error,
    isLoading
  } = useSWR<GroupEvent[], Error>(`/api/events`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    //isPaused: () => !authenticated,
    fallbackData: []
  })

  return {
    events,
    error,
    mutate,
    loading: isLoading,
    reload: () => {
      mutate()
    }
  }
}
