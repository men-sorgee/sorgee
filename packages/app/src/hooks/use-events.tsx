'use client'
import { GroupEvent } from "lib/models";
import { JsonFetcher } from "lib/utils";
import useSWR, { KeyedMutator } from "swr";

import { useAuthenticated } from "./use-authenticated";

type EventsResults = {
  events: GroupEvent[]
  error?: any
  mutate: KeyedMutator<GroupEvent[]>
  loading: boolean
  reload: () => void
}

export const useEvents = (): EventsResults => {
  const { authenticated } = useAuthenticated()
  const {
    data: events = [],
    mutate,
    error,
    isLoading
  } = useSWR<GroupEvent[], Error>(authenticated ? `/api/events` : null, {
    refreshInterval: 1000 * 60 * 10,
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
