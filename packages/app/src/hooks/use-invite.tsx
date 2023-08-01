'use client'
import {
  EventInvite,
  EventUser,
  GroupEvent,
  InviteRSVPType,
  Member
} from 'lib/models'
import { ApiResult, JsonFetcher, postJSON } from 'lib/utils'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

type InvitesResults = {
  invite: EventInvite
  event: GroupEvent
  user: Member
  loading: boolean
  mutate: (
    rsvp: InviteRSVPType,
    reason?: string
  ) => Promise<ApiResult<EventInvite>>
  reload: () => void
}

export const useInvite = (
  eventId: string,
  invitation?: EventInvite
): InvitesResults => {
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [user, setUser] = useState<Member>(undefined)
  const {
    data: invite,
    mutate,
    isLoading
  } = useSWR<EventInvite>(`/api/events/${eventId}/rsvp`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    fallbackData: invitation,
    isPaused: () => eventId == undefined
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
    mutate: async (rsvp: InviteRSVPType, reason?: string) => {
      const {
        data: i,
        success,
        error
      } = await postJSON<Partial<EventInvite>, EventInvite>(
        `/api/events/${eventId}/rsvp`,
        {
          rsvp,
          reason
        }
      )
      if (success) {
        mutate(i)
      } else {
        throw new Error(error.message)
      }
      return {
        data: i,
        success,
        error
      }
    },
    reload: () => mutate()
  }
}
