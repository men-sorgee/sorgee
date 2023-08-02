'use client'
import { EventInvite } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import { isAfter, isToday } from 'date-fns'
import useSWR from 'swr'
import { useAuthenticated } from './use-authenticated'

type InvitesResults = {
  invitations: EventInvite[]
  newInvitationCount: number
  upcoming: EventInvite[]
  activeInvite: EventInvite
  past: EventInvite[]
  error?: any
  loading: boolean
  reload: () => void
}

export const useInvites = (): InvitesResults => {
  const { authenticated } = useAuthenticated()
  const {
    data: invites = [],
    mutate,
    error,
    isLoading
  } = useSWR<EventInvite[], Error>(authenticated ? `/api/my/invites` : null, {
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
      reload: () => {},
      activeInvite: null
    }

  const upComing = ['scheduled', 'planned']
  const attending = ['confirmed', 'maybe']

  const invitations = invites?.filter(
    (i) => !attending.includes(i.rsvp) && upComing.includes(i.event.status)
  )
  const upcoming = invites?.filter(
    (i) => attending.includes(i.rsvp) && upComing.includes(i.event.status)
  )
  const past = invites?.filter(
    (i) => i.event.status == 'occurred' && i.rsvp == 'confirmed'
  )
  const newInvitationCount = invitations?.filter(
    (i) => i.rsvp == 'invited'
  ).length

  let activeInvite = upcoming.find(
    (invite: EventInvite) =>
      isToday(new Date(invite.event.datetime)) &&
      invite.rsvp == 'confirmed' &&
      !isAfter(new Date(), new Date(invite.event.datetime_end))
  )

  return {
    invitations,
    newInvitationCount,
    upcoming,
    past,
    error,
    loading: isLoading,
    reload: () => {
      mutate()
    },
    activeInvite
  }
}
