'use client'

import { JsonFetcher } from "lib/utils";
import Stripe from "stripe";
import useSWR from "swr";

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
    sessionId ? `/api/stripe/session/${sessionId}` : null,
    {
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  return {
    session,
    error,
    loading: isLoading
  }
}
