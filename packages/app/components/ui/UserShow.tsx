import { useSession } from 'next-auth/react'
import { useState, useEffect, ReactNode } from 'react'

export const UserShow = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const { status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  useEffect(() => {
    if (status !== 'loading' && !isAuthenticated) {
      console.log('isAuthenticated', isAuthenticated)
    }
  }, [status, isAuthenticated])

  return isAuthenticated ? <div>{children}</div> : <div></div>
}
