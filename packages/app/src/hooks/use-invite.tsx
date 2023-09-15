'use client'

import { EventInvite, EventUser, GroupEvent, Member } from "lib/models";
import { PurchaseResponse, RefundResponse } from "lib/services/stripe/client";
import { ApiResult, deleteJSON, getJSON, postJSON } from "lib/utils/apis";
import { useEffect, useState } from "react";
import useSWR from "swr";

export type InviteResults = {
  invite: EventInvite
  event: GroupEvent
  user: Member
  loading: boolean
  refund: (reason: string) => Promise<ApiResult<RefundResponse>>
  pay: () => Promise<ApiResult<PurchaseResponse>>
  mutate: (opts: Partial<EventUser>) => Promise<ApiResult<EventInvite>>
}

export const useInvite = (eventId: string): InviteResults => {
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [user, setUser] = useState<Member>(undefined)
  const key = eventId ? `/api/events/${eventId}/rsvp` : null
  const {
    data: invite,
    mutate,
    isLoading,
  } = useSWR<EventInvite>(key, {
    refreshInterval: 1000 * 60,
  })

  useEffect(() => {
    if (invite && event == undefined && user == undefined) {
      setEvent(invite.event)
      setUser(invite.member)
    }
  }, [invite, event, user, setEvent, setUser])

  const stripeKey = `/api/stripe/invites/${invite?.id}`
  return {
    invite,
    event,
    user,
    loading: isLoading,
    refund: () => deleteJSON<any, RefundResponse>(stripeKey),
    pay: () => getJSON<PurchaseResponse>(stripeKey),
    mutate: async ({ rsvp, reason, paid_at, paid }: Partial<EventUser>) => {
      const {
        data: i,
        success,
        error,
      } = await postJSON<Partial<EventUser>, EventInvite>(key, {
        rsvp,
        reason,
        paid_at,
        paid,
      })
      if (!success) {
        console.error(error)
      } else {
        await mutate(
          {
            ...invite,
            rsvp,
            reason,
            paid_at,
            paid,
          },
          false
        )
      }

      return {
        data: i,
        success,
        error,
      }
    },
  }
}
