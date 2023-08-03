import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthenticated() {
  const { status } = useSession()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  }, [status])

  return {
    authenticated
  }
}
