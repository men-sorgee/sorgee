'use client'
import useSWR from 'swr'
import { ApiError, ApplicationStatus, Applicant, MemberLevel, Profile, User } from 'lib/models'
import { authenticatedFetcher, getAssetUrl, postJSON } from 'lib/utils'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export type UserContextData = {
  user: Profile
  applicant: Applicant | null
  name: string | undefined
  error?: any
  loading: boolean
  register: (data: Partial<User>) => Promise<[Applicant, ApiError]>
  apply: (data: Partial<User>) => Promise<[Applicant, ApiError]>
  verify: (data: Partial<User>) => Promise<[Applicant, ApiError]>
  agree: (data: Partial<User>) => Promise<[Applicant, ApiError]>
  reload: () => Promise<Applicant>
  level: MemberLevel
  authenticated: boolean
  application_status: ApplicationStatus
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
    fallbackData: user as Member,
    refreshInterval: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (authenticated && session?.user && user == none) {
      setUser(session.user)
      _mutate(session.user as Member, {
        revalidate: true,
      })
    }
  }, [status, session?.user, user, none, authenticated, _mutate])

  useEffect(() => {
    if (!loading && member) {
      setUser(member)
    }
  }, [member, loading, _mutate, user])

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
