'use client'
import { Member, MemberLevel } from "lib/models";
import { getAssetUrl } from "lib/utils";
import useSWR from "swr";

import { useAuthenticated } from "./use-authenticated";

type MemberResults = {
  member: Member
  name: string
  picture: string
  error?: any
  loading: boolean
  level: MemberLevel
  reload: () => void
}

export const useMember = (
  id: string,
  refreshIntervalMinutes: number = 10
): MemberResults => {
  const { authenticated } = useAuthenticated()
  const canRequest = authenticated && id
  const {
    data: member,
    error,
    isLoading,
    mutate
  } = useSWR<Member, Error>(canRequest ? `/api/members/${id}` : null, {
    refreshInterval: 1000 * 60 * refreshIntervalMinutes
  })
  const level = MemberLevel[member?.user_type || 'subscriber']
  const name = member?.nickname || member?.first_name || null
  const picture = member?.picture ? getAssetUrl(member.picture) : null

  return {
    member,
    error,
    name,
    picture,
    loading: isLoading,
    reload: () => {
      mutate(undefined, true)
    },
    level
  }
}
