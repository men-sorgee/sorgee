'use client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import { UserNotification } from 'lib/models'
import { deleteJSON, JsonFetcher, putJSON } from 'lib/utils'
import useSWR from 'swr'

export type UserNotificationsContextData = {
  notifications: UserNotification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  markAsRead: (id: string) => Promise<void>
  delete: (id: string) => Promise<void>
  loading: boolean
  reload: () => void
}

export const UserNotificationsContext =
  createContext<UserNotificationsContextData>({
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

export function UserNotificationsProvider({
  children
}: {
  children: ReactNode
}) {
  const key = `/api/member/notifications`
  const {
    data: notifications = [],
    mutate,
    error,
    isLoading
  } = useSWR<UserNotification[], Error>(key, JsonFetcher, {
    refreshInterval: 1000 * 60, // 1 minutes
    refreshWhenHidden: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    fallbackData: []
  })
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const newNotifications = notifications?.filter((n) => n.read == false) || []
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

  const markAsRead = async (id: string) => {
    const { success } = await putJSON(key + '/' + id, {
      id
    })
    if (success) {
      await mutate(
        notifications.map((n) => {
          if (n.id === id) {
            status = 'read'
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

  const del = async (id: string) => {
    const { success } = await deleteJSON(key + '/' + id, {
      id
    })
    if (success) {
      await mutate(
        notifications.map((n) => {
          if (n.id !== id) {
            return n
          }
        }),
        {
          revalidate: true
        }
      )
      setHasNewNotifications(newNotifications?.length > 0)
    }
  }

  const context: UserNotificationsContextData = {
    notifications,
    hasNotifications: notifications?.length > 0,
    notificationCount: notifications?.length || 0,
    hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    markAsRead,
    delete: del,
    loading: isLoading,
    reload: () => {
      mutate()
    }
  }
  return (
    <UserNotificationsContext.Provider value={context}>
      {children}
    </UserNotificationsContext.Provider>
  )
}

export const useUserNotifications = () => useContext(UserNotificationsContext)
