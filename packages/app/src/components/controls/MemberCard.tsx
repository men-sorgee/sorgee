import { formatDistanceToNowStrict } from 'date-fns'
import {
  Member,
  MemberLevel,
  MemberLevelColorMap,
  SearchableMember,
  User
} from 'lib/models'
import NextLink from 'next/link'

import { LockIcon } from '@chakra-ui/icons'
import {
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  chakra,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text
} from '@chakra-ui/react'

import { useUser } from 'hooks'
import {
  MemberChat,
  MemberConnect,
  MemberHeader,
  MemberLike,
  MemberBlock,
  MemberShare,
  MemberReport
} from './'

type Props = CardProps & {
  viewer: Member
  member: Partial<Member>
  full?: boolean
  onClick?: () => void
}

export const MemberCard = chakra(
  ({ member, onClick, full = false, size = 'lg', ...props }: Props) => {
    const levelValue = MemberLevel[member?.user_type || 'applicant']
    const levelColor = MemberLevelColorMap[levelValue]
    const { member: viewer, reload, loading } = useUser()
    return (
      <>
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
          title={member?.nickname || member?.first_name}
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
          {...props}
        >
          <LinkBox key={member.id}>
            <CardHeader>
              <LinkOverlay
                as={NextLink}
                href={`/members/${member.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  if (member.show_profile) onClick()
                }}
              >
                <MemberHeader
                  member={member}
                  zoom={false}
                  size={size}
                  viewer={viewer}
                >
                  {!member.show_profile && (
                    <>
                      <Flex
                        px={4}
                        mt={-8}
                        direction="column"
                        w="25%"
                        align="start"
                        justify="center"
                      >
                        <LockIcon
                          color="primary.500"
                          h={20}
                          w={20}
                          mx={'auto'}
                        />
                        <Heading
                          as="h3"
                          mt={-10}
                          size="sm"
                          p={0}
                          textAlign="center"
                          color="white"
                        >
                          PRIVATE PROFILE
                        </Heading>
                      </Flex>
                    </>
                  )}
                </MemberHeader>
              </LinkOverlay>
            </CardHeader>

            {full && member?.show_profile && (
              <CardBody>
                <Text noOfLines={2} py={0} my={0}>
                  {member.biography}
                </Text>
              </CardBody>
            )}
          </LinkBox>
          <Spacer />
          <CardFooter
            flexDir="column"
            justify="space-between"
            alignItems="end"
            bg="primary.800"
            p={4}
          >
            <Flex w="full">
              <ButtonGroup>
                <MemberBlock member={member} size="lg" />
                <MemberReport member={member} size="lg" />
              </ButtonGroup>
              <Spacer />
              <ButtonGroup>
                <MemberLike member={member} size="lg" />
                <MemberChat member={member} size="lg" />
                <MemberConnect member={member} size="lg" />
                <MemberShare member={member} size="lg" />
              </ButtonGroup>
            </Flex>
            <Flex w="full">
              <Text fontSize="xs">
                {member?.show_profile && member.last_login && (
                  <>
                    Last Login:{' '}
                    {formatDistanceToNowStrict(new Date(member.last_login))} ago
                  </>
                )}
              </Text>
              <Spacer />
              <Text fontSize="xs">
                Member Since:{' '}
                {new Date(
                  member.approved_date || member.date_created
                ).toLocaleDateString()}
              </Text>
            </Flex>
          </CardFooter>
        </Card>
      </>
    )
  }
)
