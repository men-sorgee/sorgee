import { Profile, SearchableMember } from "lib/models";
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
  sort: keyof SearchableMember
  direction: 'asc' | 'desc'
  loading: boolean
  error: string
}

function useMemberSearch(
  page: number,
  size: number,
  sort: string,
  query: Record<string, any> = {}
) {
  const { authenticated } = useAuthenticated()

  const key = `/api/members?limit=${size}&page=${page}&sort=${sort}&${new URLSearchParams(
    query
  )}`
  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(
    authenticated ? key : null
  )
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({
    total: 0,
    filtered: 0
  })
  const [pageCount, setPageCount] = useState(1)
  const [members, setMembers] = useState<SearchableMember[]>([])

  useEffect(() => {
    if (response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0
      })
      setPageCount(Math.ceil(meta?.filtered ? meta.filtered / size : 1))
      setMembers(response.data)
    }
  }, [key, meta.filtered, response?.data, response?.meta, size])

  return {
    members,
    meta,
    pageCount,
    pageIndex: page,
    pageSize: size,
    sort,
    loading: !response,
    error
  }
}

export { useMemberSearch }
