'use client'

import { JsonFetcher } from 'lib/utils'
import useSWR from 'swr'
import Stripe from 'stripe'

type ProductResults = {
  session: Stripe.Checkout.Session
  error?: any
  loading: boolean
}

export const useStripeSession = (sessionId: string): ProductResults => {
  const {
    data: session,
    error,
    isLoading
  } = useSWR<Stripe.Checkout.Session, Error>(
    `/api/stripe/session/${sessionId}`,
    JsonFetcher,
    {
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      isPaused: () => sessionId == null
    }
  )

  return {
    session,
    error,
    loading: isLoading
  }
}
