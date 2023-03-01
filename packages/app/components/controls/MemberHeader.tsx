import { Flex, HStack, Badge, Box, Spacer } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { MemberCard } from './MemberCard'
import { capitalCase } from 'change-case'

import { ReactNode } from 'react'

export const MemberHeader = ({
  children,
  member,
  zoom = false,
}: {
  children?: ReactNode
  member: Partial<SearchableMember>
  zoom?: boolean
}) => {
  return (
    <>
      <Flex direction="column" justify="space-between" align="center" alignItems="center">
        <Flex justify="left" align="start" w="full">
          <MemberCard user={member} zoom={zoom} size="xl" />
          {children && (
            <>
              <Spacer />
              <Box>{children}</Box>
            </>
          )}
        </Flex>

        <Flex justify="center" align="start" my={2} w="full">
          {member?.mannerisms && (
            <Badge size="lg" colorScheme="orange" rounded={0}>
              {capitalCase(member.mannerisms)}
            </Badge>
          )}
          {member?.relationship_status && (
            <Badge size="lg" colorScheme="red" rounded={0}>
              {capitalCase(member.relationship_status)}
            </Badge>
          )}
          {member?.spectrum && (
            <Badge size={'lg'} colorScheme="blue" rounded={0}>
              {capitalCase(member.spectrum)}
            </Badge>
          )}
        </Flex>
      </Flex>
    </>
  )
}
