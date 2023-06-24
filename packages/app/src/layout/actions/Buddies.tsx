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
}

const BuddiesAction = ({ member, active, hasFeature }: Props) => {
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
        size={['sm', 'md', 'lg']}
        title="Buddy List"
        membershipType={MembershipType.basic}
        icon={<UsersIcon height="50px" width="50px" />}
      />
    )

  return (
    <>
      <Link href="/member/buddies" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          zIndex="fixed"
          size={['sm', 'md', 'lg']}
          icon={
            <Icon
              as={UsersIcon}
              w={['35px', '40px', '50px']}
              h={['35px', '40px', '50px']}
            />
          }
          color={active ? 'accent.500' : 'white'}
          aria-label="View Buddies"
          title="View Buddies"
        />
        {online > 0 && (
          <Badge
            bg={active ? 'accent.500' : 'white'}
            color={active ? 'white' : 'accent.500'}
            ml={[-6, -8, -10]}
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
