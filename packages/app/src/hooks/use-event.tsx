'use client'

import { EventDetail, EventUser } from 'lib/models'
import { ApiResult, getJSON, JsonFetcher, putJSON } from 'lib/utils'
import { useCallback } from 'react'
import useSWR from 'swr'

export type EventResults = {
  event: EventDetail | null
  error?: any
  loading: boolean
  closeEvent: () => Promise<ApiResult<EventCloseResult>>
  reload: () => void
}

export type EventCloseResult = {
  success: boolean
  noShows: number
}

export const useEvent = (
  eventId: string,
  admin: boolean = false
): EventResults => {
  const {
    data: event,
    error,
    isLoading,
    mutate
  } = useSWR<EventDetail, Error>(`/api/events/${eventId}`, JsonFetcher, {
    refreshInterval: 1000 * 60 * (admin ? 1 : 10),
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    isPaused: () => !eventId
  })

  const closeEvent = useCallback(async () => {
    const { success, data, error } = await getJSON<any, EventUser[]>(
      `/api/events/${eventId}/close`
    )

    if (!success) {
      console.error(data)
      return {
        success: false,
        noShows: 0
      }
    }

    mutate()
    return {
      success,
      data: {
        success: true,
        noShows: data.length
      },
      error
    } as ApiResult<EventCloseResult>
  }, [eventId, mutate])

  return {
    event,
    error,
    loading: isLoading,
    closeEvent,
    reload: () => {
      mutate(event, true)
    }
  }
}
