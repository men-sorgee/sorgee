'use client'
import { EventUser, InviteRSVPType } from 'lib/models'
import { ApiResult, JsonFetcher, postJSON } from 'lib/utils'
import useSWR from 'swr'

type InvitesResults = {
  invite: EventUser
  loading: boolean
  mutate: (
    rsvp: InviteRSVPType,
    reason?: string
  ) => Promise<ApiResult<EventUser>>
  reload: () => void
}

export const useInvite = (
  memberId: string,
  eventId: string
): InvitesResults => {
  const {
    data: invite,
    mutate,
    isLoading
  } = useSWR<EventUser>(`/api/events/${eventId}/rsvp`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10,
    fallbackData: {
      id: undefined,
      users_id: memberId,
      events_id: eventId,
      rsvp: 'invited'
    }
  })

  return {
    invite,
    loading: isLoading,
    mutate: async (rsvp: InviteRSVPType, reason?: string) => {
      const {
        data: i,
        success,
        error
      } = await postJSON<Partial<EventUser>, EventUser>(
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
