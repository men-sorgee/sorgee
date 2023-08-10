'use client'
import { AppNotification, AppNotificationStatusType } from "lib/models";
import { deleteJSON, getJSON, JsonFetcher, putJSON } from "lib/utils";
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

export type AppNotificationsContextData = {
  appNotifications: AppNotification[]
  hasAppNotifications: boolean
  appNotificationCount: number
  hasNewAppNotifications: boolean
  newAppNotificationCount: number
  error?: any
  readAppNotification: (id: number) => Promise<void>
  deleteAppNotification: (id: number) => Promise<void>
  appNotificationsLoading: boolean
  reloadAppNotifications: () => void
}

export const AppNotificationsContext =
  createContext<AppNotificationsContextData>({
    appNotifications: [],
    hasAppNotifications: false,
    appNotificationCount: 0,
    hasNewAppNotifications: false,
    newAppNotificationCount: 0,
    readAppNotification: async (_) => {},
    deleteAppNotification: async () => {},
    appNotificationsLoading: true,
    reloadAppNotifications: () => {}
  })

export function AppNotificationsProvider({
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
  } = useSWR<AppNotification[], Error>(authenticated ? key : null, {
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

  const readAppNotification = useCallback(
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

  const deleteAppNotification = useCallback(
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

  const context: AppNotificationsContextData = {
    appNotifications: notifications,
    hasAppNotifications: notifications?.length > 0,
    appNotificationCount: notifications?.length || 0,
    hasNewAppNotifications: hasNewNotifications,
    newAppNotificationCount: newNotifications?.length || 0,
    error,
    readAppNotification,
    deleteAppNotification,
    appNotificationsLoading: isLoading,
    reloadAppNotifications: () => {
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
