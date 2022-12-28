'use client'
import useSWR, { KeyedMutator } from 'swr'
import { AppNotification } from 'lib/models'
import { JsonFetcher } from 'lib/services/fetchers'

type NotificationResult = {
  notifications: AppNotification[]
  error?: any
  mutate: KeyedMutator<AppNotification[]>
  loading: boolean
  reload: () => void
}

export function useNotifications(authenticated: boolean): NotificationResult {
  let key = authenticated ? `/api/member/notifications` : null

  const {
    data: notifications,
    mutate,
    error,
    isLoading,
  } = useSWR<AppNotification[], Error>(key, JsonFetcher)

  return {
    notifications: notifications || [],
    error,
    mutate,
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
