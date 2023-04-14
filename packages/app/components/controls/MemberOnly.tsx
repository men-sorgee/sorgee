import { ReactNode } from 'react'
import { MemberLevel } from 'lib/models'
import { useUser } from 'hooks'

type Props = {
  minLevel?: MemberLevel
  children: ReactNode | ReactNode[]
}

export const MemberOnly = ({ children, minLevel: l }: Props) => {
  const { level, authenticated } = useUser()
  const minLevel = l || level

  return authenticated && level >= minLevel ? children : null
}
