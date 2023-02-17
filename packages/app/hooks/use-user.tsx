'use client'
import useSWR from 'swr'
import { ApiError, ApplicationStatus, Member, MemberLevel, Profile, User } from 'lib/models'
import { authenticatedFetcher, getAssetUrl, postJSON } from 'lib/utils'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

export type UserContextData = {
  user: Profile
  member: Member | null
  name: string | undefined
  picture: string
  error?: any
  loading: boolean
  mutate: (data: Partial<User>) => Promise<[Member, ApiError]>
  reload: () => Promise<Member>
  level: MemberLevel
  authenticated: boolean
  isMember: boolean
  isStaff: boolean
  isApplicant: boolean
}

export const UserContext = createContext<UserContextData>({
  user: null,
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
  const none = useMemo(() => {
    return {}
  }, [])
  const { data: session, status } = useSession()
  const [user, setUser] = useState<Profile>(none as any)
  const authenticated = status === 'authenticated'

  const {
    data: member,
    mutate: _mutate,
    error,
    isLoading: loading,
  } = useSWR<Member, Error>(key, authenticatedFetcher(authenticated), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 1000 * 60 * 3, // 3 minutes
    fallbackData: user as any,
  })

  useEffect(() => {
    if (authenticated && session?.user && user == none) {
      setUser(session.user)
      _mutate(session.user as Member, {
        revalidate: true,
      })
    }
    if (!loading && member) {
      setUser(member)
    }
  }, [status, session?.user, user, none, member, loading, _mutate])

  const { application_status, user_type } = user || {}
  const name = user?.nickname || user?.first_name || 'Member'
  const picture = getAssetUrl(user?.picture)
  const approved = ApplicationStatus[application_status] >= ApplicationStatus.approved
  const level = MemberLevel[user_type]
  const isMember = approved && level >= MemberLevel.pledge
  const isStaff = isMember && level >= MemberLevel.staff
  const isApplicant = !approved

  const mutate = async (mutation: Partial<User>) => {
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
    user,
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

export const useUser = () => useContext(UserContext)
