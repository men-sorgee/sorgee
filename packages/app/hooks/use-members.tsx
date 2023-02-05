import { ManyItems } from '@directus/sdk'
import { useEffect, useState } from 'react'
import { Profile, SearchableMember, searchableMemberFields } from '../lib/models'
import { getSearchParams, JsonFetcher } from '../lib/utils'
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

type Props = Record<keyof SearchableMember, any> & {
  page: number
  size: number
  sort_by: 'nickname' | 'last_login' | 'user_type' | 'rating'
  sort_dir: 'asc' | 'desc'
}

export default function useMemberSearch(
  page: number,
  size: number,
  sort?: string,
  filters?: Record<string, any>
) {
  const [filter] = useState<string>(getSearchParams(filters || {}))
  const key = `/api/members?limit=${size}&offset=${size * page}&sort=${sort}${filter}`
  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(key, JsonFetcher)

  const [pageCount, setPageCount] = useState(0)
  const [members, setMembers] = useState<SearchableMember[]>()
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({ total: 0, filtered: 0 })

  useEffect(() => {
    if (response) {
      const { data, meta } = response || {}
      if (data) {
        setMembers(data)
      } else {
        setMembers([])
      }

      if (meta) {
        setMeta({
          total: meta.total_count,
          filtered: meta.filter_count,
        })
        setPageCount(Math.ceil(meta.filter_count / size))
      } else {
        setPageCount(0)
        setMeta({
          total: 0,
          filtered: 0,
        })
      }
    }
  }, [response?.data])

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
