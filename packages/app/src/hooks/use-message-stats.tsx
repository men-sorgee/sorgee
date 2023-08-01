'use client'

import { UserMessages, UserMessageStats } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import useSWR from 'swr'

export type MessagesStatsContextData = {
  stats: UserMessageStats
  loading: boolean
}

export function useMessageStats(memberId: string): MessagesStatsContextData {
  const key = `/api/members/${memberId}/messages`

  const { data: stats, isLoading } = useSWR<UserMessageStats, Error>(
    key,
    JsonFetcher,
    {
      isPaused: () => memberId == undefined
    }
  )

  return {
    stats,
    loading: isLoading
  }
}
