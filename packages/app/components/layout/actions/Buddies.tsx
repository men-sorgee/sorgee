import { IconButton, Link, Badge } from '@chakra-ui/react'
import { UsersIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { Member, MemberLevel, User, UserBuddy } from 'lib/models'

interface Props {
  member: Member
  active: boolean
}

const BuddiesAction = ({ member, active }: Props) => {
  const buddies = member?.buddies as UserBuddy[]
  const online = buddies?.filter(({ buddy_id: buddy }: UserBuddy) => {
    return (buddy as User).presence == 'online'
  }).length
  const level = MemberLevel[member?.user_type]
  if (level < MemberLevel.brother) {
    return <></>
  }
  return (
    <>
      <Link href="/member/buddies" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          size="lg"
          zIndex="fixed"
          icon={<UsersIcon height="50px" width="50px" />}
          color={active ? 'accent.500' : 'white'}
          aria-label="View Buddies"
          title="View Buddies"
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
