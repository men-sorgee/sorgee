'use client'
import { GroupEvent } from "lib/models";
import useSWR from "swr";

import { useAuthenticated } from "./use-authenticated";

export type EventsAdminResults = {
  events: GroupEvent[]
  error?: Error
  loading: boolean
  reload: () => Promise<GroupEvent[]>
}

export const useEventsAdmin = (): EventsAdminResults => {
  const { authenticated } = useAuthenticated()
  const {
    data: events = [],
    mutate,
    error,
    isLoading,
  } = useSWR<GroupEvent[], Error>(authenticated ? `/api/events/admin` : null, {
    refreshInterval: 1000 * 60 * 10,
    fallbackData: [],
  })

  return {
    events,
    error,
    loading: isLoading,
    reload: () => mutate(),
  }
}
