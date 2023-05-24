import { IconButton, Link } from '@chakra-ui/react'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { Member, MemberLevel } from 'lib/models'

interface Props {
  member: Member
  active: boolean
}

const MembersAction = ({ member, active }: Props) => {
    const level = MemberLevel[member?.user_type]
  if (level < MemberLevel.brother) {
    return <></>
  }
  return (
    <>
      <Link href="/members" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          size="lg"
          zIndex="fixed"
          icon={<UserGroupIcon height="50px" width="50px" />}
          color={active ? 'accent.500' : 'white'}
          aria-label={'View Members'}
          title="View Members"
        />
      </Link>
    </>
  )
}

export default MembersAction
