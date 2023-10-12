import { useUser } from "hooks";
import { MemberLevel } from "lib/models";
import { ReactNode } from "react";

export type MemberOnlyProps = {
  minLevel?: MemberLevel
  children: ReactNode | ReactNode[]
}

export const MemberOnly = ({ children, minLevel: l }: MemberOnlyProps) => {
  const { level, authenticated } = useUser()
  const minLevel = l || level

  return authenticated && level >= minLevel ? children : null
}
