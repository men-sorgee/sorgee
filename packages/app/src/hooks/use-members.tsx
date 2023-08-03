import { Profile, SearchableMember } from "lib/models";
import { JsonFetcher } from "lib/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { ManyItems } from "@directus/sdk";

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
  const [key] = useState(
    `/api/members?limit=${size}&page=${page}&sort=${sort}&${new URLSearchParams(
      query
    ).toString()}`
  )
  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(key)
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
