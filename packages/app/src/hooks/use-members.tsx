import useSWR from 'swr'
import { ManyItems } from '@directus/sdk'
import { MemberSearchQueryParams, SearchableMember } from 'lib/models'
import { useEffect, useState } from 'react'

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
  page,
  size,
  sort = '-last_login',
  ...query
}: MemberSearchQueryParams) {
  const [members, setMembers] = useState<SearchableMember[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [meta, setMeta] = useState({
    total: 0,
    filtered: 0
  })

  const filters = Object.keys(query)
    ? `&${new URLSearchParams(query as any).toString()}`
    : ''

  const key = `/api/members?limit=${size || 20}&page=${
    page || 1
  }&sort=${sort}${filters}`

  const {
    data: response,
    error,
    isLoading,
    isValidating
  } = useSWR<ManyItems<SearchableMember>>(key, {
    keepPreviousData: false,
    refreshInterval: 0,
    fallbackData: {
      data: [],
      meta: {
        total_count: 0,
        filter_count: 0
      }
    }
  })

  useEffect(() => {
    if (response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0
      })
      setPageCount(filter_count ? Math.ceil(filter_count / size) : 0)
      setMembers(response.data as SearchableMember[])
    }
  }, [key, meta.filtered, response?.data, response?.meta, size])

  const result = {
    members,
    meta,
    pageCount,
    page: page || 1,
    pageIndex: page ? page - 1 : 0,
    pageSize: size || 20,
    sortTerm: sort?.replace('-', ''),
    direction: sort?.startsWith('-') ? 'desc' : 'asc',
    loading: isLoading || isValidating,
    error
  }

  console.dir(result)

  return result
}

export { useMemberSearch }
