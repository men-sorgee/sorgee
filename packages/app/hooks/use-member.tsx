'use client'
import useSWR, { KeyedMutator } from 'swr'
import { Member, MemberLevel, User } from 'lib/models'
import { getAssetUrl, JsonFetcher } from 'lib/utils'
import { useEffect, useState } from 'react'

type MemberResults = {
  member: Member
  name: string
  picture: string
  error?: any
  loading: boolean
  reload: () => Promise<Member>
  level: MemberLevel
}

export const useMember = (id: string, refreshIntervalMinutes: number = 5): MemberResults => {
  const {
    data: member,
    mutate,
    error,
    isLoading,
  } = useSWR<Member, Error>(`/api/member/${id || ''}`, JsonFetcher, {
    refreshInterval: 1000 * 60 * refreshIntervalMinutes,
    isPaused: () => !id || id === 'me' || id === 'null' || id === 'undefined',
    fallback: {
      '/api/member/': null,
    },
  })
  const level = MemberLevel[member?.user_type || 'subscriber']
  const name = member?.nickname || member?.first_name || null
  const picture = member?.picture ? getAssetUrl(member.picture) : null
  return {
    member,
    error,
    name,
    picture,
    reload: () => {
      return mutate(null, {
        revalidate: true,
      })
    },
    loading: isLoading,
    level,
  }
}
