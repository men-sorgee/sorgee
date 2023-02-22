'use client'
import useSWR from 'swr'
import { Member, MemberLevel } from 'lib/models'
import { getAssetUrl, JsonFetcher } from 'lib/utils'

type MemberResults = {
  member: Member
  name: string
  picture: string
  error?: any
  loading: boolean
  level: MemberLevel
}

export const useMember = (id: string, refreshIntervalMinutes: number = 5): MemberResults => {
  const {
    data: member,
    error,
    isLoading,
  } = useSWR<Member, Error>(`/api/member/${id || ''}`, JsonFetcher, {
    refreshInterval: 1000 * 60 * refreshIntervalMinutes,
    isPaused: () => !id || id === 'null' || id === 'undefined',
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
    loading: isLoading,
    level,
  }
}
