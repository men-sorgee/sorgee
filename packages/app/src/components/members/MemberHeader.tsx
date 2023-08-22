import { Lazy } from "components/controls";
import { Member } from "lib/models";
import { ReactNode } from "react";

import { Flex } from "@chakra-ui/react";

import { Rating } from "../";
import { MemberIcon, MemberIconProps } from "./MemberIcon";

export type MemberHeaderProps = MemberIconProps & {
  member: Partial<Member>
  iconChildren?: ReactNode | ReactNode[]
  children?: ReactNode
  minimal?: boolean
  onChange?: () => void
}

export const MemberHeader = ({
  member,
  iconChildren,
  children,
  minimal = false,
  size = 'lg',
  onChange,
  ...props
}: MemberHeaderProps) => {
  return (
    <Lazy>
      <Flex direction="column" align="center" justify="center" gap={2}>
        <MemberIcon member={member} size={size} onChange={() => {
          if (onChange) onChange()
        }} {...props}>

          {iconChildren}
        </MemberIcon>
        {(minimal && <>{children}</>) || (
          <Flex direction="column" justify="center" align="center" gap={1} w="full">
            {children}
            {member?.rating > 0 && (
              <Rating
                value={member.rating || 0}
                mt={2}
                itemName="User"
                tooltip="Ratings are based on the number of stars a member has received from other members and event hosts. No-shows automatically receive -1 star ratings by the event."
              />
            )}
          </Flex>
        )}
      </Flex>
    </Lazy>
  )
}
