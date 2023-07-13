import { ReactNode } from 'react'

import { capitalCase } from 'change-case'
import { Member, MemberLevel, User, UserLike, UserShare } from 'lib/models'

import {
  Badge,
  Flex,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
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
    (b) => String(b.buddy_id) == viewer?.id
  )

  const needsVoucher =
    !member.vouched_by &&
    member.user_type == 'pledge' &&
    MemberLevel[viewer?.user_type] >= MemberLevel.brother

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
          <VStack align="end">
            {children}
            {!minimal && (
              <HStack gap={1} mt={2}>
                {sharedWithMe && (
                  <Badge
                    fontSize={['xs']}
                    bg="primary.300"
                    color="white"
                    borderRadius="3px 3px 3px 3px"
                  >
                    Unlocked
                  </Badge>
                )}
                {likesYou && (
                  <Badge
                    fontSize={['xs']}
                    bg="accent.500"
                    color="white"
                    borderRadius="3px 3px 3px 3px"
                  >
                    Likes You
                  </Badge>
                )}
                {buddiesYou && (
                  <Badge
                    fontSize={['xs']}
                    bg="accent.300"
                    color="white"
                    borderRadius="3px 3px 3px 3px"
                  >
                    His Buddy
                  </Badge>
                )}

                {blocksYou && (
                  <Badge
                    fontSize={['xs']}
                    bg="red.500"
                    color="white"
                    borderRadius="3px 3px 3px 3px"
                  >
                    Blocks You
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

            {needsVoucher && (
              <Popover>
                <PopoverTrigger>
                  <Badge
                    fontSize={['xs', 'sm']}
                    bg="accent.600"
                    color="white"
                    borderRadius="3px 3px 3px 3px"
                  >
                    Needs Vouching
                  </Badge>
                </PopoverTrigger>
                <PopoverContent color="text">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    <Heading fontSize="xl" m={0}>
                      Vouching for a Pledge
                    </Heading>
                  </PopoverHeader>
                  <PopoverBody>
                    <Text>
                      Pledges can&apos;t become an inductee unless someone
                      vouches for them. If you see a Pledge that you want to get
                      to know, go ahead and reach out. You should be able to
                      chat with them regardless of you membership. If you think
                      they would make a great Brother, you can vouch for them.
                      This will promote them to Inductee.
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </Flex>
        )}
      </Flex>
    </>
  )
}
