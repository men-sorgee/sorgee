import {
  LinkBox,
  Card,
  useColorModeValue,
  CardHeader,
  LinkOverlay,
  Flex,
  Badge,
  Divider,
  CardBody,
  CardFooter,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { SearchableMember } from '../../lib/models'
import { Rating } from './Rating'
import { UserCard } from './UserCard'
import NextLink from 'next/link'
import { useMember } from 'hooks'
type Props = {
  member: Partial<SearchableMember>
  onClick: () => void
}

export const MemberCard = ({ id }: { id: string }) => {
  const { member, loading } = useMember(id)
  if (loading || !id || !member) return <></>
  return (
    <Flex direction="column" justify="flex-start" align="top">
      <UserCard user={member} size="xl" />
      <Flex align="stretch" justify="stretch" mt={4}>
        {member?.spectrum && (
          <Badge size={'lg'} colorScheme="blue">
            {member.spectrum}
          </Badge>
        )}
        {member?.relationship_status && (
          <Badge size={'lg'} colorScheme="secondary">
            {member.relationship_status}
          </Badge>
        )}
      </Flex>
    </Flex>
  )
}

export const MemberCardLink = ({ member, onClick }: Props) => {
  return (
    <>
      <LinkBox key={member.id}>
        <Card
          w="full"
          h="full"
          bg={useColorModeValue('gray.50', 'dark.700')}
          border="1px solid transparent"
          borderColor="accent.400"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
        >
          <CardHeader h={20} pb={2}>
            <LinkOverlay
              as={NextLink}
              href={`/members/${member.id}`}
              onClick={(e) => {
                e.preventDefault()
                onClick()
              }}
            >
              <UserCard user={member} />
            </LinkOverlay>
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
            </Flex>
          </CardHeader>
          <CardBody>
            <Divider />
            <Text noOfLines={2}>{member.biography}</Text>
          </CardBody>
          <CardFooter justify="space-between" alignItems="end">
            <Spacer />
            {member?.rating > 0 && (
              <Rating
                value={member.rating || 0}
                mt={2}
                aria-label="User Rating"
                size={['xs']}
                simple
              />
            )}
          </CardFooter>
        </Card>
      </LinkBox>
    </>
  )
}
