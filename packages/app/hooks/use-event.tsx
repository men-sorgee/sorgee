'use client'
import useSWR from 'swr'
import { EventDetail, Site } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type EventResults = {
  event: EventDetail | null
  error?: any
  loading: boolean
}

export const useEvent = (id: string): EventResults => {
  const {
    data: event,
    error,
    isLoading,
  } = useSWR<EventDetail, Error>(`/api/events/${id || ''}`, JsonFetcher, {
    refreshInterval: 1000 * 60 * 10,
    isPaused: () => !id || id === 'null' || id === 'undefined',
    fallback: {
      '/api/event/': null,
    },
  })

  return {
    event,
    error,
    loading: isLoading,
  }
}
