import { MemberSearchQueryParams, SearchableMember } from "lib/models";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { ManyItems } from "@directus/sdk";

import { useAuthenticated } from "./use-authenticated";

export type MemberSearchContext = {
  members: SearchableMember[]
  meta: { total: number; filtered: number }
  pageCount: number
  pageIndex: number
  pageSize: number
  sortTerm: string
  sortDirection: 'asc' | 'desc'
  loading: boolean
  error: string
}

function useMemberSearch({
  page = 1,
  size = 20,
  sort = '-last_login',
  ...query
}: Partial<MemberSearchQueryParams>) {
  const authenticated = useAuthenticated()
  const [members, setMembers] = useState<SearchableMember[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [meta, setMeta] = useState({
    total: 0,
    filtered: 0,
  })
  const [key, setKey] = useState<string>(null)
  const [filters, setFilters] = useState<string>(undefined)

  useEffect(() => {
    if (query && filters == undefined) {
      setFilters(
        Object.keys(query).length ? `&${new URLSearchParams(query as any).toString()}` : ''
      )
    }
    if (filters != undefined) {
      setKey(`/api/members?limit=${size}&page=${page}&sort=${sort}${filters}`)
    }
  }, [filters, query, page, size, sort, key])

  const {
    data: response,
    error,
    isLoading,
    isValidating,
  } = useSWR<ManyItems<SearchableMember>>(authenticated ? key : null, {
    keepPreviousData: false,
    refreshInterval: 0,
    fallbackData: {
      data: [],
      meta: {
        total_count: 0,
        filter_count: 0,
      },
    },
  })

  useEffect(() => {
    if (response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0,
      })
      setPageCount(filter_count ? Math.ceil(filter_count / size) : 0)
      setMembers(response.data as SearchableMember[])
    }
  }, [key, meta.filtered, response?.data, response?.meta, size])

  const result = {
    members,
    meta,
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

export { useMemberSearch }
