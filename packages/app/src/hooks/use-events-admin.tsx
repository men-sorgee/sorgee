'use client'
import { isAfter, isToday } from "date-fns";
import { GroupEvent } from "lib/models";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { useAuthenticated } from "./use-authenticated";

export type EventsAdminResults = {
  active: GroupEvent
  upcoming: GroupEvent[]
  past: GroupEvent[]
  error?: Error
  loading: boolean
  reload: () => Promise<GroupEvent[]>
}

export const useEventsAdmin = (): EventsAdminResults => {
  const { authenticated } = useAuthenticated()
  const [active, setActive] = useState<GroupEvent>(undefined)
  const [events, setEvents] = useState<Array<GroupEvent & { date: Date }>>(undefined)

  const {
    data,
    mutate,
    error,
    isLoading,
  } = useSWR<GroupEvent[], Error>(authenticated ? `/api/events/admin` : null, {
    refreshInterval: 1000 * 60 * 10,
    fallbackData: [],
  })

  useEffect(() => {
    if (!isLoading && data && data.length > 0) {
      setEvents(
        data.map((event) => {
          return {
            ...event,
            date: new Date(event.datetime)
          }
        })
      )
    }
  }, [data, isLoading])

  const upcoming = useMemo(() => {
    let results = events?.filter((i) => ['scheduled', 'planned'].includes(i.status)) || []
    return results.sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })
  }, [events])


  const past = useMemo(() => {
    let results = events?.filter(e => e.status == 'occurred') || []
    return results.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })
  }, [events])

  useEffect(() => {
    if (isLoading || upcoming.length > 0) return
    let activeInvite = upcoming.find(
      (event) =>
        isToday(new Date(event.datetime)) &&
        !isAfter(new Date(), new Date(event.datetime_end)) &&
        event.status == 'scheduled'
    )
    if (activeInvite)
      setActive(activeInvite)
    else
      setActive(undefined)
  }, [upcoming, active, isLoading])



  return {
    active,
    upcoming,
    past,
    error,
    loading: isLoading,
    reload: () => mutate(),
  }
}
