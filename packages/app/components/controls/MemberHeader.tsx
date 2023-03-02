import { Flex, HStack, Badge, Box, Spacer } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { MemberCard } from './MemberCard'
import { capitalCase } from 'change-case'

import { ReactNode } from 'react'

export const MemberHeader = ({
  children,
  member,
  color,
  zoom = false,
}: {
  children?: ReactNode
  member: Partial<SearchableMember>
  color?: string
  zoom?: boolean
}) => {
  return (
    <>
      <Flex direction="column" justify="space-between" align="center" alignItems="center">
        <Flex justify="left" align="center" w="full">
          <MemberCard user={member} zoom={zoom} size="xl" color={color} />
          {children && (
            <>
              <Spacer />
              <Box>{children}</Box>
            </>
          )}
        </Flex>

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
      </Flex>
    </>
  )
}
