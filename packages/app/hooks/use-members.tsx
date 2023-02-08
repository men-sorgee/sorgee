import { ManyItems } from '@directus/sdk'
import { useEffect, useState } from 'react'
import { Profile, SearchableMember } from '../lib/models'
import { JsonFetcher } from '../lib/utils'
import useSWR from 'swr'

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

export default function useMemberSearch(
  page: number,
  size: number,
  sort: string,
  query: Record<string, any> = {}
) {
  const key = `/api/members?limit=${size}&offset=${size * page}&sort=${sort}&${new URLSearchParams(
    query
  ).toString()}`
  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(key, JsonFetcher)
  const [meta] = useState<{ total: number; filtered: number }>({
    total: response?.meta?.total_count || 0,
    filtered: response?.meta?.filter_count || 0,
  })
  const [pageCount] = useState(Math.ceil(meta?.filtered ? meta.filtered / size : 1))
  const [members] = useState<SearchableMember[]>(response?.data || [])

  return {
    members,
    meta,
    pageCount,
    pageIndex: page,
    pageSize: size,
    sort,
    loading: !response,
    error,
  }
}
