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
  } = useSWR<ProductView[], Error>(`/api/stripe/products`, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: [],
  })

  return {
    products,
    error,
    loading: isLoading,
  }
}
