import { IconButton, Link } from '@chakra-ui/react'
import { UsersIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { Member, MemberLevel } from 'lib/models'

interface Props {
  member: Member
  active: boolean
}

const BuddiesAction = ({ member, active }: Props) => {
  const level = MemberLevel[member.user_type]
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
      </Link>
    </>
  )
}

export default BuddiesAction
