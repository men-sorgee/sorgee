'use client'
import { EventInvite } from "lib/models";
import { ApiResult, postJSON } from "lib/utils";
import useSWR from "swr";

export type InviteAdminProps = {
  invite: EventInvite
  loading: boolean
  checkin: (
    paid: boolean,
    amount: number,
    signed_waiver: boolean
  ) => Promise<ApiResult<EventInvite>>
  reload: () => Promise<EventInvite>
}

export const useInviteAdmin = (inviteId: string): InviteAdminProps => {
  const {
    data: invite,
    mutate,
    isLoading,
  } = useSWR<EventInvite>(inviteId ? `/api/invite/${inviteId}` : null)

  return {
    invite,
    loading: isLoading,
    checkin: async (paid: boolean, amount: number, signed_waiver: boolean) => {
      const {
        data: i,
        success,
        error,
      } = await postJSON<any, EventInvite>(`/api/invite/${inviteId}/checkin`, {
        paid,
        signed_waiver,
        amount,
      })
      if (success) {
        await mutate(i)
      } else {
        throw new Error(error.message)
      }
      return { data: i, success, error } as ApiResult<EventInvite>
    },
    reload: () => mutate(),
  }
}
