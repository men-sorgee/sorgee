import { ReactNode } from 'react'
import { Member } from 'lib/models'

import { Flex } from '@chakra-ui/react'

import { MemberIcon, MemberIconProps } from './MemberIcon'
import { Rating } from '.'

export type MemberHeaderProps = MemberIconProps & {
  member: Partial<Member>
  iconChildren?: ReactNode | ReactNode[]
  children?: ReactNode
  minimal?: boolean
}

export const MemberHeader = ({
  member,
  iconChildren,
  children,
  size,
  ...props
}: MemberHeaderProps) => {
  return (
    <>
      <Flex direction="column" align="center" justify="center" gap={2}>
        <MemberIcon member={member} size={size} {...props}>
          {iconChildren}
        </MemberIcon>

        <Flex
          direction="column"
          justify="center"
          align="center"
          my={2}
          gap={1}
          w="full"
        >
          {children}
          {member?.rating > 0 && (
            <Rating
              value={member.rating || 0}
              mt={2}
              aria-label="User Rating"
              tooltip="Ratings are based on the number of stars a member has received from other members and event hosts. No-shows automatically receive -1 star ratings by the event."
            />
          )}
        </Flex>
      </Flex>
    </>
  )
}
