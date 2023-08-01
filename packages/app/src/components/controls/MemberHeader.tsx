import { ReactNode } from 'react'

import { capitalCase } from 'change-case'
import {
  Member,
  MemberLevel,
  PresenceType,
  User,
  UserBuddy,
  UserLike,
  UserShare
} from 'lib/models'

import {
  Badge,
  Flex,
  Heading,
  HStack,
  Spacer,
  VStack,
  Text
} from '@chakra-ui/react'

import { MemberIcon, MemberIconProps } from './MemberIcon'

export type MemberHeaderProps = MemberIconProps & {
  children?: ReactNode
  member: Partial<Member>
  viewer: Member
  color?: string
  zoom?: boolean
  minimal?: boolean
}

export const MemberHeader = ({
  viewer,
  children,
  member,
  color,
  size = 'lg',
  minimal = false,
  ...props
}: MemberHeaderProps) => {
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

  return (
    <>
      <Flex
        direction="column"
        justify="space-between"
        align="center"
        alignItems="start"
        gap={2}
      >
        <MemberIcon member={member} size={size} {...props}>
          <VStack align="center" justify="stretch">
            {children}

            {!minimal && (
              <>
                <HStack flexWrap="wrap" gap={1} mt={2}>
                  {sharedWithMe && (
                    <Badge
                      fontSize={['xs']}
                      bg="primary.300"
                      color="white"
                      borderRadius="3px 3px 3px 3px"
                    >
                      Photos Unlocked
                    </Badge>
                  )}
                  {likesYou && (
                    <Badge
                      fontSize={['xs']}
                      bg="accent.500"
                      color="white"
                      borderRadius="3px 3px 3px 3px"
                    >
                      He Likes You
                    </Badge>
                  )}
                  {buddiesYou && (
                    <Badge
                      fontSize={['xs']}
                      bg="accent.300"
                      color="white"
                      borderRadius="3px 3px 3px 3px"
                    >
                      Your His Buddy
                    </Badge>
                  )}

                  {blocksYou && (
                    <Badge
                      fontSize={['xs']}
                      bg="red.500"
                      color="white"
                      borderRadius="3px 3px 3px 3px"
                    >
                      He Blocked You
                    </Badge>
                  )}
                  {isYou && (
                    <Badge
                      fontSize={['xs']}
                      bg="secondary.500"
                      color="white"
                      borderRadius="3px 3px 3px 3px"
                    >
                      This is You!
                    </Badge>
                  )}
                </HStack>
              </>
            )}
          </VStack>
        </MemberIcon>
        {!minimal && (
          <Flex justify="left" align="start" my={2} w="full">
            {member?.mannerisms && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="primary.700"
                color="white"
                borderRadius="3px 0 0 3px"
              >
                {capitalCase(member.mannerisms)}
              </Badge>
            )}
            {member?.relationship_status && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="primary.500"
                color="white"
                rounded={0}
              >
                {capitalCase(member.relationship_status)}
              </Badge>
            )}
            {member?.spectrum && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="primary.300"
                color="white"
                borderRadius="0 3px 3px 0"
              >
                {capitalCase(member.spectrum)}
              </Badge>
            )}
            <Spacer />
          </Flex>
        )}
      </Flex>
    </>
  )
}
