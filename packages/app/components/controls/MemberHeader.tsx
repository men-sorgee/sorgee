import { Flex, Badge } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { UserCard } from './UserCard'
import { capitalCase } from 'change-case'
export const MemberHeader = ({ member }: { member: Partial<SearchableMember> }) => {
  return (
    <>
      <Flex direction="column" justify="flex-between" align="top">
        <UserCard user={member} size="xl" />
        <Flex justify="start" align="start" my={2} w="full">
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
