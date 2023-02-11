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
  const [hasNotifications, setHasNotifications] = useState<boolean>(undefined)
  const [newNotifications, setNewNotifications] = useState<AppNotification[]>(undefined)
  const [hasNewNotifications, setHasNewNotifications] = useState<boolean>(undefined)

  useEffect(() => {
    if (!isLoading) {
      setHasNotifications(notifications?.length > 0)
      setNewNotifications(notifications?.filter((n) => n.status === 'new') || [])
      setHasNewNotifications(newNotifications?.length > 0)
      if (hasNewNotifications) {
        if (!window?.sessionStorage.getItem('notified')) {
          const audio = new Audio('/sounds/ding.mp3')
          audio.play()
          window?.sessionStorage.setItem('notified', 'true')
        }
      }
    }
  }, [notifications, isLoading, newNotifications?.length, hasNewNotifications])

  return {
    notifications,
    hasNotifications,
    notificationCount: notifications?.length || 0,
    hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    mark: async (id: number, state: NotificationStatusType) => {
      window?.sessionStorage.removeItem('notified')
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
