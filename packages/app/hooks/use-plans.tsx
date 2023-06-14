'use client'
import useSWR from 'swr'
import { Subscription } from 'lib/models'
import { JsonFetcher } from 'lib/utils'

type PlansResults = {
  plans: Subscription[]
  error?: any
  loading: boolean
}

export const useSite = (): PlansResults => {
  const {
    data: plans,
    error,
    isLoading,
  } = useSWR<Subscription[], Error>(`/api/stripe/pricing`, JsonFetcher, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return {
    plans,
    error,
    loading: isLoading
  }
}
