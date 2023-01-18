'use client'
import useSWR, { KeyedMutator } from 'swr'
import { Member, MemberLevel } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type MemberResults = {
  member: Member | null
  error?: any
  mutate: KeyedMutator<Member>
  loading: boolean
  reload: () => void
  level: MemberLevel
}

export const useMember = (): MemberResults => {
  const {
    data: member,
    mutate,
    error,
    isLoading,
  } = useSWR<Member, Error>(`/api/member/me`, JsonFetcher)
  const level = MemberLevel[(member?.user_type as string) || 'subscriber']
  return {
    member,
    error,
    mutate,
    loading: isLoading,
    reload: () => {
      mutate()
    },
    level,
  }
}
