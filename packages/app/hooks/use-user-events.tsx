'use client'
import useSWR from 'swr'
import { EventUser, Invite } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type InvitesResults = {
  invites: EventUser[]
  error?: any
  loading: boolean
  reload: () => void
}

export const useUserEvents = (authenticated: boolean): InvitesResults => {
  const {
    data: invites = [],
    mutate,
    error,
    isLoading,
  } = useSWR<EventUser[], Error>(`/api/member/events`, JsonFetcher, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    isPaused: () => !authenticated,
    fallbackData: [],
  })

  return {
    invites,
    error,
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
