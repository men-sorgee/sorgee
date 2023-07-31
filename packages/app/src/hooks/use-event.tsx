'use client'

import { EventDetail, EventUser } from 'lib/models'
import { getJSON, JsonFetcher, putJSON } from 'lib/utils'
import { useCallback } from 'react'
import useSWR from 'swr'

type EventResults = {
  event: EventDetail | null
  error?: any
  loading: boolean
  closeEvent: () => Promise<{ success: boolean; noShows: number }>
  reload: () => void
}

export const useEvent = (id: string): EventResults => {
  const {
    data: event,
    error,
    isLoading,
    mutate
  } = useSWR<EventDetail, Error>(`/api/events/${id}`, JsonFetcher, {
    refreshInterval: 1000 * 60 * 10,
    isPaused: () => !id || id === 'null' || id === 'undefined'
  })

  const closeEvent = useCallback(async () => {
    const { success, data } = await getJSON<any, EventUser[]>(
      `/api/events/${id}/close`
    )

    if (!success) {
      console.error(data)
      return {
        success: false,
        noShows: 0
      }
    }
    return {
      success: true,
      noShows: data.length
    }
  }, [id])

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
