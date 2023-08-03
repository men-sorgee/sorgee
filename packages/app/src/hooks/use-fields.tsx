'use client'
import { FieldMap } from "lib/models";
import { JsonFetcher } from "lib/utils";
import useSWR from "swr";

export type FieldsContext = {
  fields: FieldMap
  loading: boolean
}

export function useFields(collection: string) {
  const { data: fields, isLoading: loading } = useSWR<FieldMap>(
    collection ? `/api/site/fields/${collection}` : null
  )

  return {
    fields,
    loading
  }
}
