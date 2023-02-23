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
  const key = `/api/members?limit=${size}&page=${page}&sort=${sort}&${new URLSearchParams(
    query
  ).toString()}`
  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(key, JsonFetcher)
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({
    total: 0,
    filtered: 0,
  })
  const [pageCount, setPageCount] = useState(1)
  const [members, setMembers] = useState<SearchableMember[]>([])

  useEffect(() => {
    if (response?.meta) {
      setMeta({
        total: response?.meta?.total_count || 0,
        filtered: response?.meta?.filter_count || 0,
      })
      setPageCount(Math.ceil(meta?.filtered ? meta.filtered / size : 1))
    }
    if (response.data) {
      setMembers(response.data)
    }
  }, [key, response?.meta])

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
