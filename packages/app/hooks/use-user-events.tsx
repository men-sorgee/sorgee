'use client'
import useSWR from 'swr'
import { EventUser, Invite } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type InvitesResults = {
  invitations: EventUser[]
  upcoming: EventUser[]
  past: EventUser[]
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

  const upComing = ['scheduled', 'planned']
  const attending = ['confirmed', 'maybe']

  const invitations = invites?.filter(
    (i) => !attending.includes(i.rsvp) && upComing.includes(i.events_id.status)
  )
  const upcoming = invites?.filter(
    (i) => attending.includes(i.rsvp) && upComing.includes(i.events_id.status)
  )
  const past = invites?.filter((i) => i.events_id.status == 'occurred')

  return {
    invitations,
    upcoming,
    past,
    error,
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
