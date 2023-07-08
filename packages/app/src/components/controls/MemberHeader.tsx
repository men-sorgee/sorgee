import { ReactNode } from 'react'

import { capitalCase } from 'change-case'
import { Member, MemberLevel, User, UserLike, UserShare } from 'lib/models'

import {
  Badge,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text
} from '@chakra-ui/react'

import { MemberIcon, MemberIconProps } from './MemberIcon'

export type MemberHeaderProps = MemberIconProps & {
  children?: ReactNode
  member: Partial<User>
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
  const photo_shares = (member.photo_shares as UserShare[]) || []
  const sharedWithMe = photo_shares?.some(
    (s: UserShare) => String(s.viewer_id) == viewer?.id
  )
  const likes = (member.likes as UserLike[]) || []
  const likesYou = likes?.some((l: UserLike) => String(l.like_id) == viewer?.id)

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
        alignItems="center"
        gap={2}
      >
        <MemberIcon member={member} size={size} {...props}>
          {children}
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
            {sharedWithMe && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="primary.300"
                color="white"
                borderRadius="3px 3px 3px 3px"
              >
                Album Unlocked
              </Badge>
            )}
            {likesYou && (
              <Badge
                fontSize={['xs', 'sm']}
                bg="accent.300"
                color="white"
                borderRadius="3px 3px 3px 3px"
                ml={2}
              >
                Likes You
              </Badge>
            )}

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
