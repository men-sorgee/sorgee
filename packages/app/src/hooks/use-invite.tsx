'use client'
import { EventInvite, EventUser, GroupEvent, Member } from "lib/models";
import { ApiResult, postJSON } from "lib/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

export type InviteResults = {
  invite: EventInvite
  event: GroupEvent
  user: Member
  loading: boolean
  mutate: (opts: Partial<EventUser>) => Promise<ApiResult<EventInvite>>
}

export const useInvite = (eventId: string, eventUser?: EventInvite): InviteResults => {
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [user, setUser] = useState<Member>(undefined)

  const {
    data: invite,
    mutate,
    isLoading,
  } = useSWR<EventInvite>(eventId ? `/api/events/${eventId}/rsvp` : null, {
    refreshInterval: 0,
    keepPreviousData: false,
    fallbackData: eventUser,
  })

  useEffect(() => {
    if (invite && event == undefined && user == undefined) {
      setEvent(invite.event)
      setUser(invite.member)
    }
  }, [invite, event, user, setEvent, setUser])

  return {
    invite,
    event,
    user,
    loading: isLoading,
    mutate: async ({ rsvp, reason, paid = false }: Partial<EventUser>) => {
      // Paid is passed to the mutation, but not the API.
      // This is to assume they paid if they used the pay button,
      // for the sake of the UI. However, the actual payment needs
      // to be handled by the Stripe API, confirming they paid.
      let paid_at = paid ? new Date().toISOString() : undefined
      const {
        data: i,
        success,
        error,
      } = await postJSON<Partial<EventUser>, EventInvite>(`/api/events/${eventId}/rsvp`, {
        rsvp,
        reason,
        paid_at,
      })
      if (!success) {
        console.error(error)
      }
      mutate({ ...i, paid, paid_at })
      return {
        data: i,
        success,
        error,
      }
    },
  }
}
