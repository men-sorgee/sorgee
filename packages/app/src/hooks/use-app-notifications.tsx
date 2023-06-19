'use client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import { AppNotification, AppNotificationStatusType } from 'lib/models'
import { JsonFetcher, putJSON } from 'lib/utils'
import useSWR from 'swr'

export type AppNotificationsContextData = {
  notifications: AppNotification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  markAsRead: (id: number) => Promise<void>
  delete: (id: number) => Promise<void>
  loading: boolean
  reload: () => void
}

export const AppNotificationsContext =
  createContext<AppNotificationsContextData>({
    notifications: [],
    hasNotifications: false,
    notificationCount: 0,
    hasNewNotifications: false,
    newNotificationCount: 0,
    markAsRead: async (_) => {},
    delete: async () => {},
    loading: true,
    reload: () => {}
  })

export function AppNotificationsProvider({
  children
}: {
  children: ReactNode
}) {
  const key = `/api/notifications`
  const {
    data: notifications = [],
    mutate,
    error,
    isLoading
  } = useSWR<AppNotification[], Error>(key, JsonFetcher, {
    refreshInterval: 1000 * 60 * 3, // 3 minutes
    refreshWhenHidden: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    fallbackData: []
  })
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const newNotifications = notifications?.filter((n) => !n.read) || []
  useEffect(() => {
    if (!isLoading && notifications) {
      setHasNewNotifications(newNotifications?.length > 0)
    }
  }, [notifications, isLoading, newNotifications?.length, hasNewNotifications])

  const put = async (id: number, state: 'deleted' | 'read') => {
    const { success } = await putJSON(key + '/' + id, {
      id,
      state
    })
    if (success) {
      await mutate(
        notifications.map((n) => {
          if (n.id === id) {
            n.read = true
            state === 'deleted' ? (n.status = 'deleted') : null
          }
          return n
        }),
        {
          revalidate: true
        }
      )
      setHasNewNotifications(newNotifications?.length > 0)
    }
  }

  const context: AppNotificationsContextData = {
    notifications,
    hasNotifications: notifications?.length > 0,
    notificationCount: notifications?.length || 0,
    hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    markAsRead: (id: number) => put(id, 'read'),
    delete: (id: number) => put(id, 'deleted'),
    loading: isLoading,
    reload: () => {
      mutate()
    }
  }
  return (
    <AppNotificationsContext.Provider value={context}>
      {children}
    </AppNotificationsContext.Provider>
  )
}

export const useAppNotifications = () => useContext(AppNotificationsContext)
