import {
  LinkBox,
  Card,
  useColorModeValue,
  LinkOverlay,
  CardBody,
  CardFooter,
  Spacer,
  Text,
  chakra,
  CardProps,
} from '@chakra-ui/react'
import { SearchableMember } from 'lib/models'
import { Rating } from './Rating'
import { MemberHeader } from './MemberHeader'
import NextLink from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'
type Props = CardProps & {
  member: Partial<SearchableMember>
  onClick?: () => void
}

export const MemberProfileCard = chakra(({ member, onClick, ...props }: Props) => {
  return (
    <>
      <LinkBox key={member.id}>
        <Card
          w="full"
          h="full"
          bg={useColorModeValue('gray.100', 'gray.700')}
          border="1px solid transparent"
          borderColor="accent.400"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
          {...props}
        >
          <CardBody>
            <LinkOverlay
              as={NextLink}
              href={`/members/${member.id}`}
              onClick={(e) => {
                e.preventDefault()
                onClick()
              }}
            >
              <MemberHeader member={member} zoom={false} />
            </LinkOverlay>
            <Text noOfLines={2} py={0} my={0}>
              {member.biography}
            </Text>
          </CardBody>
          <CardFooter justify="space-between" alignItems="end">
            {member.last_login && (
              <Text fontSize="xs">
                Last Login: {formatDistanceToNowStrict(new Date(member.last_login))} ago
              </Text>
            )}
            <Spacer />
            <Text display="none">
              Ratings are based on the number of stars a member has received from other members and
              event hosts. No-shows automatically receive 2-star ratings by the event. Members must
              have an average of 4-stars to be eligible for events.
            </Text>
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
})
