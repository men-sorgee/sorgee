'use client'
import { GroupEvent } from "lib/models";
import { JsonFetcher } from "lib/utils";
import useSWR from "swr";

import { useAuthenticated } from "./use-authenticated";

type EventsResults = {
  events: GroupEvent[]
  error?: Error
  loading: boolean
  reload: () => Promise<GroupEvent[]>
}

export const useEventsAdmin = (): EventsResults => {
  const { authenticated } = useAuthenticated()
  const {
    data: events = [],
    mutate,
    error,
    isLoading
  } = useSWR<GroupEvent[], Error>(authenticated ? `/api/events/admin` : null, {
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
