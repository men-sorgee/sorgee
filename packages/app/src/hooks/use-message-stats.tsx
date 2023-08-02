'use client'
import { UserMessageStats } from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import useSWR from 'swr'

export type MessagesStatsContextData = {
  stats: UserMessageStats
  loading: boolean
}

export function useMessageStats(memberId: string): MessagesStatsContextData {
  const { data: stats, isLoading } = useSWR<UserMessageStats, Error>(
    memberId ? `/api/members/${memberId}/messages` : null,
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
