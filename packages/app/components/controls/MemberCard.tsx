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
import { Member, SearchableMember } from '../../lib/models'
import { Rating } from './Rating'
import { MemberHeader } from './MemberHeader'
import NextLink from 'next/link'

type Props = {
  member: Partial<SearchableMember>
  onClick?: () => void
}

export const MemberCard = ({ member, onClick }: Props) => {
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
              <MemberHeader member={member} />
            </LinkOverlay>
            <Text noOfLines={2} py={0} my={0}>
              {member.biography}
            </Text>
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
