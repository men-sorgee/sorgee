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
  activeInvite: EventInvite
  past: EventInvite[]
  error?: any
  loading: boolean
  reload: () => void
  mutate: (invite: EventInvite, shouldRevalidate?: boolean) => void
  updateRSVP: (eventId: string, rsvp: string, reason: string) => Promise<EventInvite>
}

export const useInvites = (): InvitesResults => {
  const [activeInvite, setActiveInvite] = useState<EventInvite>(null)
  const { authenticated } = useAuthenticated()
  const {
    data: invites = [],
    mutate,
    error,
    isLoading,
  } = useSWR<EventInvite[], Error>(authenticated ? `/api/my/invites` : null, {
    refreshInterval: 1000 * 60 * 10,
    fallbackData: [],
  })

  const upComing = useMemo(() => ['scheduled', 'planned'], [])
  const attending = useMemo(() => ['confirmed', 'maybe'], [])

  const invitations = useMemo(() => invites?.filter((i) =>
    (!i.rsvp || !attending.includes(i.rsvp)) &&
    upComing.includes(i.event.status)) || [], [attending, invites, upComing])

  const upcoming = useMemo(() => invites?.filter(
    (i) => attending.includes(i.rsvp) && upComing.includes(i.event.status)
  ) || [], [attending, invites, upComing])

  const past = useMemo(() => invites?.filter((i) => i.event.status == 'occurred' && i.rsvp == 'confirmed') || [], [invites])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newInvitationCount = useMemo(() => invitations?.filter((i) => i.rsvp == 'invited').length || 0, [invites, invitations])

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
