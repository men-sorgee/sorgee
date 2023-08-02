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
import { useAuthenticated } from './use-authenticated'

export type UserNotificationsContextData = {
  notifications: UserNotification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
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
    deleteNotification: async () => {},
    loading: true,
    reload: () => {}
  })

export function UserNotificationsProvider({
  children
}: {
  children: ReactNode
}) {
  const { authenticated } = useAuthenticated()
  const key = `/api/my/notifications`
  const {
    data: notifications = [],
    mutate,
    error,
    isLoading
  } = useSWR<UserNotification[], Error>(authenticated ? key : null, {
    refreshInterval: 1000 * 60, // 1 minutes
    fallbackData: []
  })
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const newNotifications = notifications?.filter((n) => n?.read != true) || []
  useEffect(() => {
    if (!isLoading && notifications) {
      setHasNewNotifications(newNotifications?.length > 0)
    }
  }, [notifications, isLoading, newNotifications?.length, hasNewNotifications])

  const markAsRead = async (id: string) => {
    const { success } = await putJSON(key + '/' + id, {
      id
    })
    if (success) {
      await mutate([
        ...notifications.map(({ id: i, read, ...props }) => {
          if (i === id) {
            read = true
          }
          return {
            id: i,
            read,
            ...props
          }
        })
      ])

      setHasNewNotifications(newNotifications?.length > 0)
    }
  }

  const del = async (id: string) => {
    const { success } = await deleteJSON(key + '/' + id, {
      id
    })
    if (success) {
      await mutate([...notifications.filter((n) => n.id !== id)])
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
    deleteNotification: del,
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
