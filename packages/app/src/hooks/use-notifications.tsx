'use client'
import { Notification } from "lib/models";
import { deleteJSON, getJSON } from "lib/utils";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import useSWR from "swr";

import { useAuthenticated } from "./use-authenticated";

export type NotificationsContextData = {
  notifications: Notification[]
  hasNotifications: boolean
  notificationCount: number
  hasNewNotifications: boolean
  newNotificationCount: number
  error?: any
  readNotification: (id: number) => Promise<void>
  deleteNotification: (id: number) => Promise<void>
  notificationsLoading: boolean
  reloadNotifications: () => void
}

export const NotificationsContext =
  createContext<NotificationsContextData>({
    notifications: [],
    hasNotifications: false,
    notificationCount: 0,
    hasNewNotifications: false,
    newNotificationCount: 0,
    readNotification: async (_) => { },
    deleteNotification: async () => { },
    notificationsLoading: true,
    reloadNotifications: () => { }
  })

export function NotificationsProvider({
  children
}: {
  children: ReactNode
}) {
  const { authenticated } = useAuthenticated()
  const key = `/api/notifications`
  const {
    data: notifications = [],
    mutate,
    error,
    isLoading
  } = useSWR<Notification[], Error>(authenticated ? key : null, {
    refreshInterval: 1000 * 60 * 10, // 10 minutes
    fallbackData: []
  })
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const newNotifications = notifications?.filter((n) => !n.read) || []
  useEffect(() => {
    if (!isLoading && notifications) {
      setHasNewNotifications(newNotifications?.length > 0)
    }
  }, [notifications, isLoading, newNotifications?.length, hasNewNotifications])

  const readNotification = useCallback(
    async (id: number) => {
      const { success } = await getJSON<Partial<Notification>>(key + '/' + id)
      if (success) {
        await mutate(
          [
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
          ],
          {
            revalidate: true
          }
        )
      }
    },
    [key, mutate, notifications]
  )

  const deleteNotification = useCallback(
    async (id: number) => {
      const { success } = await deleteJSON(key + '/' + id)
      if (success) {
        await mutate([...notifications.filter((i) => i.id !== id)], {
          revalidate: true
        })
      }
    },
    [key, mutate, notifications]
  )

  const context: NotificationsContextData = {
    notifications: notifications,
    hasNotifications: notifications?.length > 0,
    notificationCount: notifications?.length || 0,
    hasNewNotifications: hasNewNotifications,
    newNotificationCount: newNotifications?.length || 0,
    error,
    readNotification: readNotification,
    deleteNotification: deleteNotification,
    notificationsLoading: isLoading,
    reloadNotifications: () => {
      mutate()
    }
  }
  return (
    <NotificationsContext.Provider value={context}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
