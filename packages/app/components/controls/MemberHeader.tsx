import { Flex, Badge } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { UserCard } from './UserCard'

export const MemberHeader = ({ member }: { member: Partial<SearchableMember> }) => {
  return (
    <>
      <Flex direction="column" justify="flex-start" align="top" w="full">
        <UserCard user={member} size="xl" />
        <Flex justify="end" align="end" mt={-4} mb={2} w="full">
          {member?.spectrum && (
            <Badge size={'lg'} colorScheme="blue" rounded={0}>
              {member.spectrum}
            </Badge>
          )}
          {member?.relationship_status && (
            <Badge size="lg" colorScheme="red" rounded={0}>
              {member.relationship_status}
            </Badge>
          )}
          {member?.mannerisms && (
            <Badge size="lg" colorScheme="orange" rounded={0}>
              {member.mannerisms}
            </Badge>
          )}
        </Flex>
      </Flex>
    </>
  )
}
