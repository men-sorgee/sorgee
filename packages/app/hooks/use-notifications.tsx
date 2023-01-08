'use client'
import useSWR from 'swr'
import { AppNotification, NotificationStatus } from 'lib/models'
import { JsonFetcher } from 'lib/services/fetchers'
import { putJSON } from 'lib/utils'
import { useState, useEffect, createContext } from 'react'

interface NotificationResult {
  notifications: AppNotification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  mark: (id: number, state: NotificationStatus) => Promise<void>
  loading: boolean
  reload: () => void
}
export const NotificationContext = createContext<NotificationResult>({
  notifications: [],
  hasNotifications: false,
  notificationCount: 0,
  hasNewNotifications: false,
  newNotificationCount: 0,
  mark: async () => {},
  loading: true,
  reload: () => {},
})

export function useNotifications(): NotificationResult {
  const {
    data: notifications,
    mutate,
    error,
    isLoading,
  } = useSWR<AppNotification[], Error>(`/api/member/notifications`, JsonFetcher, {
    refreshInterval: 1000 * 30, // 30 seconds
    fallbackData: [],
  })
  let hasNotifications = notifications?.length > 0
  let newNotifications = notifications?.filter((n) => n.status === 'new')
  let hasNewNotifications = !isLoading && newNotifications?.length > 0
  useEffect(() => {
    hasNotifications = notifications?.length > 0
    newNotifications = notifications?.filter((n) => n.status === 'new') || []
    hasNewNotifications = !isLoading && newNotifications?.length > 0
  }, [notifications, isLoading])

  return {
    notifications,
    hasNotifications,
    notificationCount: notifications?.length || 0,
    hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    mark: async (id: number, state: NotificationStatus) => {
      const [ok, data] = await putJSON(`/api/member/notifications`, {
        id,
        state,
      })
      if (ok) {
        mutate(
          notifications.map((n) => {
            if (n.id === id) {
              n.status = state
            }
            return n
          }),
          {
            revalidate: true,
          }
        )
      } else {
        console.error(data.error)
      }
    },
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
