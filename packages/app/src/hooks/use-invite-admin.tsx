'use client'
import { EventInvite, EventUser } from "lib/models";
import { ApiResult, JsonFetcher, postJSON } from "lib/utils";
import useSWR from "swr";

type InviteAdminProps = {
  invite: EventInvite
  loading: boolean
  checkin: (
    paid: boolean,
    signed_waiver: boolean
  ) => Promise<ApiResult<EventInvite>>
  reload: () => Promise<EventInvite>
}

export const useInviteAdmin = (inviteId: string): InviteAdminProps => {
  const {
    data: invite,
    mutate,
    isLoading
  } = useSWR<EventInvite>(inviteId ? `/api/invite/${inviteId}` : null)

  return {
    invite,
    loading: isLoading,
    checkin: async (paid: boolean, signed_waiver: boolean) => {
      const {
        data: i,
        success,
        error
      } = await postJSON<any, EventInvite>(`/api/invite/${inviteId}/checkin`, {
        paid,
        signed_waiver
      })
      if (success) {
        await mutate(i)
      } else {
        throw new Error(error.message)
      }
      return { data: i, success, error } as ApiResult<EventInvite>
    },
    reload: () => mutate()
  }
}
