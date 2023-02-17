'use client'
import useSWR from 'swr'
import { AppNotification, NotificationStatusType } from 'lib/models'
import { putJSON, JsonFetcher } from 'lib/utils'
import { useState, useEffect, createContext, ReactNode, useContext } from 'react'
import { UserContextData } from './use-user'
import { useSession } from 'next-auth/react'

export type NotificationsContextData = {
  notifications: AppNotification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  mark: (id: number, state: NotificationStatusType) => Promise<void>
  markAsRead: (id: number) => Promise<void>
  delete: (id: number) => Promise<void>
  loading: boolean
  reload: () => void
}

export const NotificationsContext = createContext<NotificationsContextData>({
  notifications: [],
  hasNotifications: false,
  notificationCount: 0,
  hasNewNotifications: false,
  newNotificationCount: 0,
  mark: async () => {},
  markAsRead: async (_) => {},
  delete: async () => {},
  loading: true,
  reload: () => {},
})

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const key = `/api/member/notifications`
  const {
    data: notifications = [],
    mutate,
    error,
    isLoading,
  } = useSWR<AppNotification[], Error>(key, JsonFetcher<AppNotification[]>, {
    refreshInterval: 1000 * 60 * 3, // 3 minutes
    fallbackData: [],
  })
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const newNotifications = notifications?.filter((n) => n.status === 'new') || []
  useEffect(() => {
    if (!isLoading && notifications) {
      setHasNewNotifications(newNotifications?.length > 0)
    }
    if (hasNewNotifications) {
      if (!sessionStorage.getItem('notified')) {
        sessionStorage.setItem('notified', 'true')
      }
    }
  }, [notifications, isLoading, newNotifications?.length, hasNewNotifications])

  const mark = async (id: number, state: NotificationStatusType) => {
    const { success, data } = await putJSON(key, {
      id,
      state,
    })
    if (success) {
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
    }
  }

  const context: NotificationsContextData = {
    notifications,
    hasNotifications: notifications?.length > 0,
    notificationCount: notifications?.length || 0,
    hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    mark,
    markAsRead: (id: number) => mark(id, 'read'),
    delete: (id: number) => mark(id, 'deleted'),
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
  return <NotificationsContext.Provider value={context}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => useContext(NotificationsContext)
