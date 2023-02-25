'use client'
import useSWR from 'swr'
import { EventUser, GroupEvent, Invite } from 'lib/models'
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
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    isPaused: () => !authenticated,
    fallbackData: [],
  })

  if (!authenticated)
    return { invitations: [], upcoming: [], past: [], loading: false, reload: () => {} }

  const upComing = ['scheduled', 'planned']
  const attending = ['confirmed', 'maybe']

  if (invites == null)
    return { invitations: [], upcoming: [], past: [], loading: true, reload: () => {} }

  const getEvent = (e: EventUser) => {
    return e.events_id as GroupEvent
  }
  const invitations = invites?.filter(
    (i) => !attending.includes(i.rsvp) && upComing.includes(getEvent(i).status)
  )
  const upcoming = invites?.filter(
    (i) => attending.includes(i.rsvp) && upComing.includes(getEvent(i).status)
  )
  const past = invites?.filter((i) => getEvent(i).status == 'occurred')

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
