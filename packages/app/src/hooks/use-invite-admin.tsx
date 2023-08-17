'use client'
import { EventInvite } from "lib/models";
import { postJSON } from "lib/utils";
import useSWR from "swr";

export type InviteAdminProps = {
  invite: EventInvite
  loading: boolean
  checkin: (
    paid: boolean,
    amount: number,
    signed_waiver: boolean
  ) => Promise<EventInvite>
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
    checkin: (paid: boolean, amount: number, signed_waiver: boolean) => {
      return postJSON<any, EventInvite>(`/api/invite/${inviteId}/checkin`, {
        paid,
        signed_waiver,
        amount,
      })
        .then(({
          data: i
        }) =>
          mutate(i)
        )

    },
    reload: () => mutate(),
  }
}
