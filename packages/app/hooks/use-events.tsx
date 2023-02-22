'use client'
import useSWR, { KeyedMutator } from 'swr'
import { GroupEvent, Member, Site } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type EventsResults = {
  events: GroupEvent[]
  error?: any
  mutate: KeyedMutator<GroupEvent[]>
  loading: boolean
  reload: () => void
}

export const useEvents = (user: Partial<Member>): EventsResults => {
  const {
    data: events = [],
    mutate,
    error,
    isLoading,
  } = useSWR<GroupEvent[], Error>(`/api/events`, JsonFetcher, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    isPaused: () => !user,
    fallbackData: [],
  })

  return {
    events,
    error,
    mutate,
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
