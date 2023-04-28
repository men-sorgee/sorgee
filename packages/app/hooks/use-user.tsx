'use client'
import useSWR from 'swr'
import { ApiError, ApplicationStatus, Member, MemberLevel, Profile, User } from 'lib/models'
import { JsonFetcher, authenticatedFetcher, getAssetUrl, postJSON } from 'lib/utils'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export type UserContextData = {
  member: Member | null
  name: string | undefined
  picture: string
  error?: any
  loading: boolean
  mutate: (data: Partial<Member>) => Promise<[Member, ApiError]>
  reload: () => Promise<Member>
  level: MemberLevel
  authenticated: boolean
  isMember: boolean
  isStaff: boolean
  isApplicant: boolean
}

export const UserContext = createContext<UserContextData>({
  member: null,
  name: undefined,
  error: undefined,
  loading: true,
  picture: undefined,
  mutate: () => Promise.resolve([null, null]),
  reload: () => Promise.resolve(null),
  level: MemberLevel.subscriber,
  authenticated: false,
  isMember: false,
  isStaff: false,
  isApplicant: false,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const key = `/api/member/me`
  const { status } = useSession()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      setAuthenticated(true)
    }
  }, [status])

  const {
    data: member,
    mutate: _mutate,
    error,
    isLoading: loading,
  } = useSWR<Member, Error>(key, JsonFetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 5,
  })

  const { application_status, user_type } = member || {}
  const name = member?.nickname || member?.first_name || 'Brother'
  const picture = getAssetUrl(member?.picture)
  const approved = ApplicationStatus[application_status] >= ApplicationStatus.approved
  const level = MemberLevel[user_type]
  const isMember = approved && level >= MemberLevel.pledge
  const isStaff = isMember && level >= MemberLevel.staff
  const isApplicant = !approved

  const mutate = async (mutation: Partial<Member>) => {
    await _mutate({ ...member, ...mutation } as Member, false)
    const { success, data, error } = await postJSON<Member>(key, mutation as any)
    if (success) {
      await _mutate(data, false)
      return [data, null]
    } else {
      await _mutate(member, false)
      return [null, error]
    }
  }

  const context: UserContextData = {
    member,
    error,
    name,
    picture,
    mutate: mutate as any,
    reload: () => {
      return _mutate(
        { ...member },
        {
          revalidate: true,
        }
      )
    },
    loading,
    level,
    authenticated,
    isMember,
    isStaff,
    isApplicant,
  }
  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}

export const useUser = (
  minLevel: MemberLevel = MemberLevel.brother,
  minAppStatus: ApplicationStatus = ApplicationStatus.approved
): UserContextData & {
  authorized: boolean
} => {
  const router = useRouter()
  const { level, loading, member, ...data } = useContext(UserContext)
  let authorized = level >= minLevel

  useEffect(() => {
    if (!loading && member) {
      const status = ApplicationStatus[member.application_status]
      if (status < minAppStatus) {
        const destination = '/apply/' + member.application_status
        if (router.asPath != destination) router.push(destination)
      }
    }
  }, [authorized, loading, member, minAppStatus, router])

  return {
    ...data,
    level,
    loading,
    member,
    authorized,
  }
}
