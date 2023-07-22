'use client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  ApiError,
  ApiResponse,
  ApplicationStatus,
  Member,
  MemberFeature,
  MemberLevel,
  MembershipType
} from 'lib/models'
import { ApiResult, getAssetUrl, JsonFetcher, postJSON } from 'lib/utils'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export type UserContextData = {
  member: Member | null
  name: string | undefined
  picture: string
  error?: any
  loading: boolean
  mutate: (data: Partial<Member>) => Promise<ApiResult<Member>>
  reload: () => Promise<Member>
  level: MemberLevel
  subscription?: MembershipType
  authenticated: boolean
  isMember: boolean
  isBrother: boolean
  isStaff: boolean
  isApplicant: boolean
  hasFeature: (feature: MemberFeature) => boolean
}

export const UserContext = createContext<UserContextData>({
  member: null,
  name: undefined,
  error: undefined,
  loading: true,
  picture: undefined,
  mutate: () => Promise.resolve(null),
  reload: () => Promise.resolve(null),
  level: MemberLevel.subscriber,
  subscription: MembershipType.none,
  authenticated: false,
  isMember: false,
  isBrother: false,
  isStaff: false,
  isApplicant: false,
  hasFeature: (feature: MemberFeature) => false
})

export function UserProvider({ children }: { children: ReactNode }) {
  const key = `/api/member/me`
  const { status } = useSession()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  }, [status])

  const {
    data: member,
    mutate: _mutate,
    error,
    isLoading: loading
  } = useSWR<Member, Error>(key, JsonFetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000 * 60 * 5
  })

  const { application_status, user_type, membership_type } = member || {}
  const name = member?.nickname || member?.first_name || 'Brother'
  const picture = getAssetUrl(member?.picture)
  const approved =
    ApplicationStatus[application_status] >= ApplicationStatus.approved
  const level = MemberLevel[user_type]
  const isMember = approved && level >= MemberLevel.pledge
  const isBrother = isMember && level >= MemberLevel.brother
  const isStaff = isMember && level >= MemberLevel.staff
  const isApplicant = !approved

  const mutate = async (mutation: Partial<Member>) => {
    await _mutate({ ...member, ...mutation } as Member, false)
    const result = await postJSON<Member>(key, mutation as any)
    const { success, data } = result
    if (success) {
      await _mutate(data, false)
      return result
    } else {
      await _mutate(member, false)
      return result
    }
  }
  const hasFeature = (feature: MemberFeature): boolean => {
    if (!member) return false
    if (isStaff) return true
    if (level == MemberLevel.big_brother) return true
    return member.has_features?.includes(feature)
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
          revalidate: true
        }
      )
    },
    loading,
    level,
    subscription: MembershipType[membership_type],
    authenticated,
    isMember,
    isBrother,
    isStaff,
    isApplicant,
    hasFeature
  }
  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}

type UseUserProps = {
  minLevel?: MemberLevel
  minAppStatus?: ApplicationStatus
  requiredFeature?: MemberFeature
  redirectsEnabled?: boolean
}
export const useUser = ({
  minLevel,
  minAppStatus,
  redirectsEnabled = false,
  requiredFeature
}: UseUserProps = {}): UserContextData & {
  authorized: boolean
} => {
  const router = useRouter()
  const { level, loading, member, authenticated, hasFeature, ...data } =
    useContext(UserContext)
  let authorized = level >= minLevel

  useEffect(() => {
    if (!redirectsEnabled) return
    if (!loading && member?.application_status) {
      if (authenticated) {
        const status = ApplicationStatus[member.application_status]
        if (status < minAppStatus) {
          const destination = '/apply/' + member.application_status
          if (router.asPath != destination)
            router.push(destination, destination).catch(console.error)
          return
        }
        if (level < minLevel) {
          const destination = `/unauthorized?level=${MemberLevel[minLevel]}`
          if (router.asPath != destination)
            router.push(destination, destination).catch(console.error)
          return
        }
        if (requiredFeature && !hasFeature(requiredFeature)) {
          const destination = `/member/subscription?feature=${requiredFeature}`
          if (router.asPath != destination)
            router.push(destination, destination).catch(console.error)
          return
        }
      } else {
        signIn().catch(console.error)
      }
    }
  }, [
    authenticated,
    authorized,
    redirectsEnabled,
    loading,
    member,
    minAppStatus,
    router,
    level,
    minLevel,
    requiredFeature,
    hasFeature
  ])

  return {
    ...data,
    authenticated,
    level,
    loading,
    member,
    authorized,
    hasFeature
  }
}
