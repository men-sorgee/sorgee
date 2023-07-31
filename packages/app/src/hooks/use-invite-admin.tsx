'use client'
import { EventInvite, EventUser } from 'lib/models'
import { ApiResult, JsonFetcher, postJSON } from 'lib/utils'
import useSWR from 'swr'

type InviteAdminProps = {
  invite: EventInvite
  loading: boolean
  checkin: (
    paid: boolean,
    signed_waiver: boolean
  ) => Promise<ApiResult<EventInvite>>
  reload: () => void
}

export const useInviteAdmin = (id: string): InviteAdminProps => {
  const {
    data: invite,
    mutate,
    isLoading
  } = useSWR<EventInvite>(`/api/invite/${id}`, JsonFetcher, {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 10
  })

  return {
    invite,
    loading: isLoading,
    checkin: async (paid: boolean, signed_waiver: boolean) => {
      const {
        data: i,
        success,
        error
      } = await postJSON<any, EventInvite>(`/api/invite/${id}/checkin`, {
        paid,
        signed_waiver
      })
      if (success) {
        mutate(i)
      } else {
        throw new Error(error.message)
      }
      return { data: i, success, error }
    },
    reload: () => mutate()
  }
}
