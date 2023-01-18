'use client'
import useSWR from 'swr'
import { AppNotification, NotificationStatusType } from 'lib/models'
import { putJSON, JsonFetcher } from 'lib/utils'
import { useState, useEffect, createContext } from 'react'

interface NotificationResult {
  notifications: AppNotification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  mark: (id: number, state: NotificationStatusType) => Promise<void>
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
  const [hasNotifications, setHasNotifications] = useState(false)
  const [newNotifications, setNewNotifications] = useState<AppNotification[]>([])
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  useEffect(() => {
    setHasNotifications(notifications?.length > 0)
    setNewNotifications(notifications?.filter((n) => n.status === 'new') || [])
    setHasNewNotifications(newNotifications?.length > 0)
  }, [notifications, isLoading, newNotifications?.length])

  return {
    notifications,
    hasNotifications,
    notificationCount: notifications?.length || 0,
    hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    mark: async (id: number, state: NotificationStatusType) => {
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
