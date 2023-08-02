import { Member, UserBuddy, UserLike, UserShare } from 'lib/models'
import {
  chakra,
  Flex,
  Badge,
  ResponsiveValue,
  FlexProps
} from '@chakra-ui/react'

type Props = FlexProps & {
  viewer: Member
  member: Partial<Member>
  fontSize?: ResponsiveValue<string | number>
}

export const MemberRelationBanner = chakra(
  ({ member, viewer, fontSize = ['xs', 'sm'], ...props }: Props) => {
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

    const showBar = sharedWithMe || likesYou || isYou || blocksYou || buddiesYou

    const badgeProps = {
      px: 2,
      py: 0.5,
      fontSize,
      color: 'white',
      rounded: 'full'
    }

    if (!showBar) return null

    return (
      <>
        <Flex
          direction="row"
          justify="center"
          align="center"
          gap={1}
          p={1}
          w="full"
          {...props}
        >
          {blocksYou && (
            <>
              <Badge bg="red.400" {...badgeProps}>
                Blocked You
              </Badge>
            </>
          )}
          {isYou && (
            <>
              <Badge bg="accent.400" {...badgeProps}>
                You
              </Badge>
            </>
          )}
          {likesYou && (
            <>
              <Badge bg="primary.500" {...badgeProps}>
                Likes You
              </Badge>
            </>
          )}
          {buddiesYou && (
            <>
              <Badge bg="primary.400" {...badgeProps}>
                Buddies You
              </Badge>
            </>
          )}
          {sharedWithMe && (
            <>
              <Badge bg="primary.600" {...badgeProps}>
                Unlocked
              </Badge>
            </>
          )}
        </Flex>
      </>
    )
  }
)
