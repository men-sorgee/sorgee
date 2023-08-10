'use client'

import Stripe from "stripe";
import useSWR from "swr";

export type StripResults = {
  session: Stripe.Checkout.Session
  error?: any
  loading: boolean
}

export const useStripeSession = (sessionId: string): StripResults => {
  const {
    data: session,
    error,
    isLoading,
  } = useSWR<Stripe.Checkout.Session, Error>(
    sessionId ? `/api/stripe/session/${sessionId}` : null,
    {
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    session,
    error,
    loading: isLoading,
  }
}
