'use client'
import { EventInvite, EventUser, GroupEvent, Member } from 'lib/models'
import { ApiResult, deleteJSON, getJSON, postJSON } from 'lib/utils'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { PurchaseResponse, RefundResponse } from '../components'

export type InviteResults = {
  invite: EventInvite
  event: GroupEvent
  user: Member
  loading: boolean
  refund: () => Promise<ApiResult<RefundResponse>>
  pay: () => Promise<ApiResult<PurchaseResponse>>
  mutate: (opts: Partial<EventUser>) => Promise<ApiResult<EventInvite>>
}

export const useInvite = (eventId: string): InviteResults => {
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [user, setUser] = useState<Member>(undefined)

  const {
    data: invite,
    mutate,
    isLoading,
  } = useSWR<EventInvite>(eventId ? `/api/events/${eventId}/rsvp` : null, {
    refreshInterval: 1000 * 60,
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
    refund: () => deleteJSON<RefundResponse>(`/api/stripe/invite/${invite?.id}`),
    pay: () => getJSON<PurchaseResponse>(`/api/stripe/invite/${invite?.id}`),
    mutate: async ({ rsvp, reason, paid_at }: Partial<EventUser>) => {
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
      await mutate(i)
      return {
        data: i,
        success,
        error,
      }
    },
  }
}
