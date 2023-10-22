'use client'

import { useSession } from "next-auth/react";
import { MemberLevel, User } from "../lib/models";

export function useAuthenticated(minimumLevel: MemberLevel = MemberLevel.applicant) {
  const { status, data } = useSession({
    required: false
  })
  const results = {
    authenticated: status === 'authenticated',
    loading: status === 'loading',
    user: data?.user
  }

  if (!!results.loading && MemberLevel[data?.user?.user_type || 'reject'] < minimumLevel)
    return {
      ...results,
      authenticated: false,
    }

  return results

}
