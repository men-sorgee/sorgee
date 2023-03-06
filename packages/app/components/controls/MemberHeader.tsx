import { Flex, Badge, Box, Spacer } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { MemberCard, MemberCardProps } from './MemberCard'
import { capitalCase } from 'change-case'

import { ReactNode } from 'react'

export type MemberHeaderProps = MemberCardProps & {
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
  size = 'xl',
  minimal,
  ...props
}: MemberHeaderProps) => {
  return (
    <>
      <Flex direction="column" justify="space-between" align="center" alignItems="center">
        <Flex direction={['column', 'row']} gap={2} justify="space-between" align="left" w="full">
          <MemberCard member={member} size={size} {...props}>
            {children}
          </MemberCard>
        </Flex>
        {!minimal && (
          <Flex justify="left" align="start" my={2} w="full">
            {member?.mannerisms && (
              <Badge size="lg" bg="primary.700" color="white" borderRadius="3px 0 0 3px">
                {capitalCase(member.mannerisms)}
              </Badge>
            )}
            {member?.relationship_status && (
              <Badge size="lg" bg="primary.500" color="white" rounded={0}>
                {capitalCase(member.relationship_status)}
              </Badge>
            )}
            {member?.spectrum && (
              <Badge size={'lg'} bg="primary.300" color="white" borderRadius="0 3px 3px 0">
                {capitalCase(member.spectrum)}
              </Badge>
            )}
          </Flex>
        )}
      </Flex>
    </>
  )
}
