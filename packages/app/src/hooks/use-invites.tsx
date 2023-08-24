'use client'

import { isAfter, isToday } from "date-fns";
import { EventInvite } from "lib/models";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { postJSON } from "../lib/utils";
import { useAuthenticated } from "./use-authenticated";

export type InvitesResults = {
  invitations: EventInvite[]
  newInvitationCount: number
  upcoming: EventInvite[]
  declined: EventInvite[]
  activeInvite: EventInvite
  past: EventInvite[]
  error?: any
  loading: boolean
  reload: () => void
  mutate: (invite: EventInvite, shouldRevalidate?: boolean) => void
  updateRSVP: (eventId: string, rsvp: string, reason: string) => Promise<EventInvite>
}

function take<T>(arr: Array<T>, filter: (_: T) => boolean) {
  let take = []
  let leave = []
  arr.forEach(item => {
    if (filter(item)) take.push(item)
    else leave.push(item)
  })
  arr = leave
  return take
}

export const useInvites = (): InvitesResults => {
  const [activeInvite, setActiveInvite] = useState<EventInvite>(null)
  const { authenticated } = useAuthenticated()
  const {
    data,
    mutate,
    error,
    isLoading,
  } = useSWR<EventInvite[], Error>(authenticated ? `/api/my/invites` : null, {
    refreshInterval: 1000 * 60 * 10,
    fallbackData: [],
  })

  let invites = useMemo(() => [...data], [data])

  let past = take<EventInvite>(invites, (i) =>
    i.event.status == 'occurred' && i.rsvp == 'confirmed')

  let upcoming = take<EventInvite>(invites, (i) =>
    ['confirmed', 'maybe'].includes(i.rsvp) && ['scheduled', 'planned'].includes(i.event.status))

  let declined = take<EventInvite>(invites, (i) =>
    ['declined', 'cancelled'].includes(i.rsvp) && ['scheduled', 'planned'].includes(i.event.status))

  let invitations = take<EventInvite>(invites, (i) =>
    (!i.rsvp || i.rsvp == 'invited') && ['scheduled', 'planned'].includes(i.event.status))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newInvitationCount = useMemo(() => invitations?.filter((i) => i.rsvp == 'invited').length || 0,
    [invitations])

  useEffect(() => {
    let activeInvite = upcoming.find(
      (invite: EventInvite) =>
        isToday(new Date(invite.event.datetime)) &&
        invite.rsvp == 'confirmed' &&
        !isAfter(new Date(), new Date(invite.event.datetime_end))
    )
    if (activeInvite)
      setActiveInvite(activeInvite)
    else
      setActiveInvite(null)
  }, [upcoming, activeInvite])

  const updateRSVP = useCallback((eventId: string, rsvp: string, reason: string) => {
    return postJSON<any, EventInvite>(`/api/events/${eventId}/rsvp`, {
      rsvp,
      reason,
    }).then(({ data }) => {
      mutate([...invites.filter(i => i.event?.id != eventId), data], false)
      return data
    })
  }, [invites, mutate])

  if (invites == null || invites == undefined)
    return {
      invitations: [],
      newInvitationCount: 0,
      upcoming: [],
      declined: [],
      past: [],
      loading: true,
      mutate: (_) => null,
      reload: () => { },
      updateRSVP: () => Promise.resolve(null),
      activeInvite: null,
    }


  return {
    invitations,
    newInvitationCount,
    upcoming,
    declined,
    past,
    error,
    loading: isLoading,
    mutate: (invite: EventInvite, shouldRevalidate: boolean = false) => {
      let data = [...invitations.filter(i => i?.id != invite.id), invite]
      mutate(data, shouldRevalidate)
    },
    updateRSVP,
    reload: () => {
      mutate(null, true)
    },
    activeInvite,
  }
}
