import { Flex, Badge, Box, Spacer } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { MemberIcon, MemberIconProps } from './MemberIcon'
import { capitalCase } from 'change-case'

import { ReactNode } from 'react'

export type MemberHeaderProps = MemberIconProps & {
  children?: ReactNode
  member: Partial<SearchableMember>
  color?: string
  zoom?: boolean
  minimal?: boolean
}

export const MemberHeader = ({
  children,
  member,
  color,
  size = 'lg',
  minimal = false,
  ...props
}: MemberHeaderProps) => {
  return (
    <>
      <Flex direction={'column'} justify="space-between" align="center" alignItems="center" gap={2}>
        <MemberIcon member={member} size={size} {...props}>
          {children}
        </MemberIcon>

        {minimal == false && (
          <Flex justify="left" align="start" my={2} w="full">
            {member?.mannerisms && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="primary.700"
                color="white"
                borderRadius="3px 0 0 3px"
              >
                {capitalCase(member.mannerisms)}
              </Badge>
            )}
            {member?.relationship_status && (
              <Badge fontSize={['xs', 'sm']} bg="primary.500" color="white" rounded={0}>
                {capitalCase(member.relationship_status)}
              </Badge>
            )}
            {member?.spectrum && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="primary.300"
                color="white"
                borderRadius="0 3px 3px 0"
              >
                {capitalCase(member.spectrum)}
              </Badge>
            )}
          </Flex>
        )}
      </Flex>
    </>
  )
}
