'use client'
import { ProductView } from "lib/models";
import useSWR from "swr";

export type ProductResults = {
  products: ProductView[]
  error?: any
  loading: boolean
}

export const useProducts = (): ProductResults => {
  const {
    data: products,
    error,
    isLoading,
  } = useSWR<ProductView[], Error>(`/api/stripe/subscriptions`, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,

  })

  return {
    products,
    error,
    loading: isLoading,
  }
}
