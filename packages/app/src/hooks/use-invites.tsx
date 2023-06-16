'use client'
import { EventInvite } from '@lib/models'
import { JsonFetcher } from '@lib/utils'
import useSWR from 'swr'

type InvitesResults = {
  invitations: EventInvite[]
  newInvitationCount: number
  upcoming: EventInvite[]
  past: EventInvite[]
  error?: any
  loading: boolean
  reload: () => void
}

export const useUserEvents = (): InvitesResults => {
  const {
    data: invites = [],
    mutate,
    error,
    isLoading
  } = useSWR<EventInvite[], Error>(`/api/member/invites`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    fallbackData: []
  })

  if (invites == null || invites == undefined)
    return {
      invitations: [],
      newInvitationCount: 0,
      upcoming: [],
      past: [],
      loading: true,
      reload: () => {}
    }

  const upComing = ['scheduled', 'planned']
  const attending = ['confirmed', 'maybe']

  const invitations = invites?.filter(
    (i) => !attending.includes(i.rsvp) && upComing.includes(i.event.status)
  )
  const upcoming = invites?.filter(
    (i) => attending.includes(i.rsvp) && upComing.includes(i.event.status)
  )
  const past = invites?.filter((i) => i.event.status == 'occurred')
  const newInvitationCount = invitations?.filter(
    (i) => i.rsvp == 'invited'
  ).length

  return {
    invitations,
    newInvitationCount,
    upcoming,
    past,
    error,
    loading: isLoading,
    reload: () => {
      mutate()
    }
  }
}
