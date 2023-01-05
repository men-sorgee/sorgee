'use client'
import useSWR, { KeyedMutator } from 'swr'
import { Member, MemberLevel } from 'lib/models'
import { JsonFetcher } from '@/lib/services/fetchers'

type MemberResults = {
  member: Member | null
  error?: any
  mutate: KeyedMutator<Member>
  loading: boolean
  reload: () => void
  level: MemberLevel
}

export const useMember = (): MemberResults => {
  const key = `/api/member/me`
  const { data: member, mutate, error, isLoading } = useSWR<Member, Error>(key, JsonFetcher)
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
