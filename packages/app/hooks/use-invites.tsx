'use client'
import useSWR from 'swr'
import { EventUser, GroupEvent } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type InvitesResults = {
  invitations: EventUser[]
  upcoming: EventUser[]
  past: EventUser[]
  error?: any
  loading: boolean
  reload: () => void
}

export const useUserEvents = (): InvitesResults => {
  const {
    data: invites = [],
    mutate,
    error,
    isLoading,
  } = useSWR<EventUser[], Error>(`/api/member/invites`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    fallbackData: [],
  })

  if (invites == null || invites == undefined)
    return { invitations: [], upcoming: [], past: [], loading: true, reload: () => {} }

  const upComing = ['scheduled', 'planned']
  const attending = ['confirmed', 'maybe']

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
