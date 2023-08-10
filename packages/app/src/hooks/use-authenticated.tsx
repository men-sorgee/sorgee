import { useSession } from "next-auth/react";

export function useAuthenticated() {
  const { status } = useSession({
    required: false
  })

  return {
    authenticated: status === 'authenticated',
    loading: status === 'loading'
  }
}
