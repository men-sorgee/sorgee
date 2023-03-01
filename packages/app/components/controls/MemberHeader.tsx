import { Flex, Badge } from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { MemberCard } from './MemberCard'
import { capitalCase } from 'change-case'
export const MemberHeader = ({
  member,
  zoom = false,
}: {
  member: Partial<SearchableMember>
  zoom?: boolean
}) => {
  return (
    <>
      <Flex direction="column" justify="flex-between" align="top">
        <MemberCard user={member} zoom={zoom} size="xl" />
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
