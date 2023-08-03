'use client'
import { ProductView } from "lib/models";
import { JsonFetcher } from "lib/utils";
import useSWR from "swr";

type ProductResults = {
  products: ProductView[]
  error?: any
  loading: boolean
}

export const useProducts = (): ProductResults => {
  const {
    data: products,
    error,
    isLoading
  } = useSWR<ProductView[], Error>(`/api/stripe/products`, JsonFetcher, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: []
  })

  return {
    products,
    error,
    loading: isLoading
  }
}
