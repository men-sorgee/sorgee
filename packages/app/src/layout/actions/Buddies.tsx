import { UpgradeIcon } from 'components/controls'
import {
  Member,
  MemberLevel,
  MembershipType,
  User,
  UserBuddy
} from 'lib/models'
import NextLink from 'next/link'

import { Badge, Icon, IconButton, Link } from '@chakra-ui/react'
import { UsersIcon } from '@heroicons/react/24/outline'

interface Props {
  member: Member
  active: boolean
  hasFeature: boolean
  iconSize?: string[]
  iconDimensions?: string[]
}

const BuddiesAction = ({
  member,
  active,
  hasFeature,
  iconSize,
  iconDimensions
}: Props) => {
  const level = MemberLevel[member?.user_type]
  if (level < MemberLevel.brother) {
    return null
  }
  const buddies = member?.buddies as UserBuddy[]
  const online = buddies?.filter(({ buddy_id: buddy }: UserBuddy) => {
    return (buddy as User)?.presence == 'online'
  }).length

  if (!hasFeature)
    return (
      <UpgradeIcon
        size={iconSize}
        title="Buddy List"
        membershipType={MembershipType.basic}
        icon={
          <Icon as={UsersIcon} width={iconDimensions} height={iconDimensions} />
        }
      />
    )

  return (
    <>
      <Link href="/member/buddies" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          zIndex="fixed"
          size={iconSize}
          icon={<Icon as={UsersIcon} w={iconDimensions} h={iconDimensions} />}
          color={active ? 'accent.500' : 'white'}
          aria-label="View Buddies"
          title="View Buddies"
          w={iconDimensions}
        />
        {online > 0 && (
          <Badge
            bg={active ? 'accent.500' : 'white'}
            color={active ? 'white' : 'accent.500'}
            ml={-4}
            zIndex="overlay"
            position="absolute"
            rounded="full"
            px={2}
            py={0.5}
          >
            {online}
          </Badge>
        )}
      </Link>
    </>
  )
}

export default BuddiesAction
