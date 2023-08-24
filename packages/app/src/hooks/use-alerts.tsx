'use client'
import { MemberAlert } from "lib/models";
import { deleteJSON, putJSON } from "lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import useSWR from "swr";

import { useAuthenticated } from "./use-authenticated";

export type MemberAlertsContextData = {
  alerts: MemberAlert[]
  hasAlerts: boolean
  alertCount: number
  hasNewAlerts: boolean
  newAlertCount: number
  error?: any
  markAsRead: (id: string) => Promise<void>
  deleteAlert: (id: string) => Promise<void>
  alertsLoading: boolean
  reloadAlerts: () => void
}

export const AlertsContext = createContext<MemberAlertsContextData>({
  alerts: [],
  hasAlerts: false,
  alertCount: 0,
  hasNewAlerts: false,
  newAlertCount: 0,
  markAsRead: async (_) => { },
  deleteAlert: async () => { },
  alertsLoading: true,
  reloadAlerts: () => { },
})

export function AlertsProvider({ children }: { children: ReactNode }) {
  const { authenticated } = useAuthenticated()
  const key = `/api/my/alerts`
  const {
    data: notifications = [],
    mutate,
    error,
    isLoading,
  } = useSWR<MemberAlert[], Error>(authenticated ? key : null, {
    refreshInterval: 1000 * 60 * 5,
    keepPreviousData: false
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
      id,
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
            ...props,
          }
        }),
      ])

      setHasNewNotifications(newNotifications?.length > 0)
    }
  }

  const del = async (id: string) => {
    const { success } = await deleteJSON(`${key}/${id}`)
    if (success) {
      await mutate([...notifications.filter((n) => n.id !== id)])
    }
  }

  const context: MemberAlertsContextData = {
    alerts: notifications,
    hasAlerts: notifications?.length > 0,
    alertCount: notifications?.length || 0,
    hasNewAlerts: hasNewNotifications,
    newAlertCount: newNotifications?.length || 0,
    error,
    markAsRead,
    deleteAlert: del,
    alertsLoading: isLoading,
    reloadAlerts: () => {
      mutate()
    },
  }
  return (
    <AlertsContext.Provider value={context}>
      {children}
    </AlertsContext.Provider>
  )
}

export const useAlerts = () => useContext(AlertsContext)
