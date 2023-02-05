'use client'
import { ApplicationStatus, MemberLevel, Member } from 'lib/models'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSite } from './use-site'

type AuthResults = {
  authenticated: boolean
  user?: Member
  isMember: boolean
  isStaff: boolean
  isApplicant: boolean
  showApply: boolean
}

export const useAuth = (): AuthResults => {
  const { data: session } = useSession()
  const { site, loading } = useSite()
  const { user } = session || {}
  const { application_status, user_type } = user || {}
  const [level, setLevel] = useState<number>(-1)
  const [approved, setApproved] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && application_status && level == -1) {
      setLevel(MemberLevel[user_type])
      setApproved(ApplicationStatus[application_status] >= ApplicationStatus.approved)
    }
  }, [level, loading, application_status, user_type, approved])

  const isMember = approved && level >= MemberLevel.pledge
  const isStaff = isMember && level >= MemberLevel.staff
  const isApplicant = !approved
  const showApply = !site?.invite_only

  return {
    authenticated: !!session,
    user: user as Member,
    isMember,
    isStaff,
    isApplicant,
    showApply,
  }
}
