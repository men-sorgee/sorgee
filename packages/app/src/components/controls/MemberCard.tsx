import { formatDistanceToNowStrict } from 'date-fns'
import {
  Member,
  MemberLevel,
  MemberLevelColorMap,
  SearchableMember,
  User,
  UserBuddy,
  UserLike,
  UserShare
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
  Show,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  Badge
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useUser } from 'hooks'

import {
  MemberMessageStats,
  MemberMessages,
  MemberBuddy,
  MemberHeader,
  MemberLike,
  MemberBlock,
  MemberShare,
  MemberReport,
  Rating,
  MemberActions,
  MemberAttributeBanner,
  MemberRelationBanner
} from './'

type Props = CardProps & {
  viewer: Member
  member: Partial<Member>
  full?: boolean
  onClick?: () => void
  children?: ReactNode | ReactNode[]
}

export const MemberCard = chakra(
  ({
    member,
    onClick,
    full = false,
    size = 'lg',
    children,
    ...props
  }: Props) => {
    const levelValue = MemberLevel[member?.user_type || 'applicant']
    const levelColor = MemberLevelColorMap[levelValue]
    const { member: viewer, level } = useUser()
    const sharedWithMe = member.photo_shares?.some(
      (s: UserShare) => String(s.viewer_id) == viewer?.id
    )
    const likesYou = member.likes?.some(
      (l: UserLike) => String(l.like_id) == viewer?.id
    )
    const isYou = String(member.id) == viewer?.id

    const blocksYou = member?.blocked?.some(
      (b) => String(b.blocked_id) == viewer?.id
    )
    const buddiesYou = member?.buddies?.some(
      (b: UserBuddy) => b.user_id == viewer?.id
    )
    const badgeProps = {
      px: 2,
      py: 0.5,
      fontSize: ['xs', 'sm'],
      color: 'white',
      rounded: 0
    }

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
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
          {...props}
        >
          <LinkBox key={member.id}>
            <CardHeader>
              <LinkOverlay
                as={NextLink}
                href={`/member/${member.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  if (member.show_profile) onClick()
                }}
              >
                <MemberHeader member={member} size={size}>
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
                  <MemberAttributeBanner member={member} />
                </MemberHeader>
              </LinkOverlay>
            </CardHeader>

            <CardBody pt={0}>
              {levelValue == MemberLevel.pledge && (
                <MemberMessageStats memberId={member?.id} viewerLevel={level} />
              )}
              {children}
              {full && member?.show_profile && (
                <>
                  <Text noOfLines={2} py={0} my={0}>
                    {member.biography}
                  </Text>
                </>
              )}
            </CardBody>
          </LinkBox>
          <Spacer />
          <MemberRelationBanner
            member={member}
            viewer={viewer}
            bg={'primary.900'}
          />
          <CardFooter
            flexDir="column"
            justify="space-between"
            alignItems="end"
            bg="primary.800"
            p={4}
          >
            <MemberActions member={member} size={size} />
          </CardFooter>
        </Card>
      </>
    )
  }
)
