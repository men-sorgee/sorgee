'use client'
import useSWR, { KeyedMutator } from 'swr'
import { GroupEvent, Member, Site } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import { useUser } from './use-user'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type EventsResults = {
  events: GroupEvent[]
  error?: any
  mutate: KeyedMutator<GroupEvent[]>
  loading: boolean
  reload: () => void
}

export const useEvents = (): EventsResults => {
  const { status } = useSession()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (status == 'authenticated' && !authenticated) {
      setAuthenticated(true)
    }
  }, [authenticated, status])

  const {
    data: events = [],
    mutate,
    error,
    isLoading,
  } = useSWR<GroupEvent[], Error>(`/api/events`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    //isPaused: () => !authenticated,
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
