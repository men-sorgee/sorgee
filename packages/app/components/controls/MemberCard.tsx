import {
  LinkBox,
  Card,
  LinkOverlay,
  CardBody,
  CardFooter,
  Spacer,
  Text,
  chakra,
  CardProps,
  CardHeader,
  Box,
} from '@chakra-ui/react'
import { SearchableMember, MemberLevelColorMap, MemberLevel } from 'lib/models'
import { MemberHeader, MemberChat, MemberConnect } from '.'
import NextLink from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'

type Props = CardProps & {
  member: Partial<SearchableMember>
  onClick?: () => void
}

export const MemberCard = chakra(({ member, onClick, ...props }: Props) => {
  const levelValue = MemberLevel[member?.user_type]
  const levelColor = MemberLevelColorMap[levelValue]
  return (
    <>
      <LinkBox key={member.id}>
        <Card
          w="full"
          h="full"
          bgGradient={`linear(to-bl, ${levelColor[0]}, ${levelColor[1]})`}
          rounded="lg"
          border="1px solid transparent"
          borderColor="primary"
          color="white"
          minW="full"
          overflow="hidden"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
          {...props}
        >
          <CardHeader>
            <LinkOverlay
              as={NextLink}
              href={`/members/${member.id}`}
              onClick={(e) => {
                e.preventDefault()
                onClick()
              }}
            >
              <MemberHeader member={member} zoom={false}></MemberHeader>{' '}
            </LinkOverlay>
          </CardHeader>

          <CardBody>
            <Text noOfLines={2} py={0} my={0}>
              {member.biography}
            </Text>

            <Spacer />
            <Text display="none">
              Ratings are based on the number of stars a member has received from other members and
              event hosts. No-shows automatically receive 2-star ratings by the event. Members must
              have an average of 4-stars to be eligible for events.
            </Text>
          </CardBody>

          <CardFooter justify="space-between" alignItems="end">
            <Text fontSize="xs">
              {member.last_login && (
                <>
                  Last Login: {formatDistanceToNowStrict(new Date(member.last_login))} ago
                  <br />
                </>
              )}
              Member Since:{' '}
              {new Date(member.approved_date || member.date_created).toLocaleDateString()}
            </Text>
            <MemberChat member={member} />
            <MemberConnect member={member} />
          </CardFooter>
        </Card>
      </LinkBox>
    </>
  )
})
