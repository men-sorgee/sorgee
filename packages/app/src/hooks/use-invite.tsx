'use client'
import { EventInvite, GroupEvent, InviteRSVPType, Member } from "lib/models";
import { ApiResult, postJSON } from "lib/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

export type InviteMutateProps = { rsvp: InviteRSVPType; paid?: boolean; reason?: string }

export type InviteResults = {
  invite: EventInvite
  event: GroupEvent
  user: Member
  loading: boolean
  mutate: (opts: InviteMutateProps) => Promise<ApiResult<EventInvite>>
}

export const useInvite = (eventId: string, invitation?: EventInvite): InviteResults => {
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [user, setUser] = useState<Member>(undefined)
  const {
    data: invite,
    mutate,
    isLoading,
  } = useSWR<EventInvite>(eventId ? `/api/events/${eventId}/rsvp` : null, {
    fallbackData: invitation,
    keepPreviousData: false,
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
    mutate: async ({ rsvp, reason, paid = false }: InviteMutateProps) => {
      // Paid is passed to the mutation, but not the API.
      // This is to assume they paid if they used the pay button,
      // for the sake of the UI. However, the actual payment needs
      // to be handled by the Stripe API, confirming they paid.
      const {
        data: i,
        success,
        error,
      } = await postJSON<Partial<EventInvite>, EventInvite>(`/api/events/${eventId}/rsvp`, {
        rsvp,
        reason,
      })
      if (!success) {
        console.error(error)
      }
      await mutate({ ...i, paid })
      return {
        data: i,
        success,
        error,
      }
    },
  }
}
