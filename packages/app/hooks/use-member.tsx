'use client'
import useSWR, { KeyedMutator } from 'swr'
import { Member, MemberLevel, User } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import { useEffect, useState } from 'react'

type MemberResults = {
  member: Member | null
  name: string | undefined
  error?: any
  loading: boolean
  reload: () => Promise<Member>
  level: MemberLevel
}

export const useMember = (id: string = 'me', refreshIntervalMinutes: number = 5): MemberResults => {
  const {
    data: member,
    mutate,
    error,
    isLoading,
  } = useSWR<Member, Error>(`/api/member/${id}`, JsonFetcher, {
    refreshInterval: 1000 * 60 * refreshIntervalMinutes,
  })
  const level = MemberLevel[member?.user_type || 'subscriber']
  const name = member?.nickname || member?.first_name || 'Member'

  return {
    member,
    error,
    name,
    reload: () => {
      return mutate(null, {
        revalidate: true,
      })
    },
    loading: isLoading,
    level,
  }
}
