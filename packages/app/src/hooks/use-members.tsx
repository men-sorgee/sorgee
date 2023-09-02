'use client'

import {
  MemberSearchQueryParams,
  MemberSearchResults,
  SearchableMember
} from "lib/models";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { useAuthenticated } from "./use-authenticated";

export type MemberSearchContext = {
  members: SearchableMember[]
  meta: { total: number; filtered: number }
  reload: () => void
  pageCount: number
  pageIndex: number
  pageSize: number
  sortTerm: string
  sortDirection: 'asc' | 'desc'
  loading: boolean
  error: string
}

export const useMemberSearch = (
  { page = 1, size = 20, sort = '-last_login', ...query }: Partial<MemberSearchQueryParams>,
  skip: boolean = false
) => {
  const authenticated = useAuthenticated()
  const [members, setMembers] = useState<SearchableMember[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [meta, setMeta] = useState({
    total: 0,
    filtered: 0,
  })
  const [filters, setFilters] = useState<string>(undefined)

  useEffect(() => {
    setFilters(
      Object.keys(query).length ? `&${new URLSearchParams(query as any).toString()}` : ''
    )
  }, [filters, setFilters, query, page, size, sort])

  const key = `/api/members?limit=${size}&page=${page}&sort=${sort}${filters || ''}`

  const {
    data: response,
    error,
    isLoading,
    isValidating,
  } = useSWR<MemberSearchResults>(authenticated && !skip
    ? key
    : null, {
    keepPreviousData: false,
    refreshInterval: 0,
    fallbackData: {
      data: [],
      meta: {
        total: 0,
        count: 0,
      },
    },
  })

  useEffect(() => {
    if (response?.meta) {
      const { total = 0, count = 0 } = response.meta
      setMeta({
        total,
        filtered: count,
      })
      setPageCount(count ? Math.ceil(count / size) : 0)
      setMembers(response.data as SearchableMember[])
    }
  }, [meta.filtered, response?.data, response?.meta, size])

  const result = {
    members,
    meta,
    reload: () => {
      mutate(key, true)
    },
    pageCount,
    page,
    pageIndex: page - 1,
    pageSize: size,
    sortTerm: sort?.replace('-', ''),
    direction: sort?.startsWith('-') ? 'desc' : 'asc',
    loading: isLoading || isValidating,
    error,
  }

  return result
}
