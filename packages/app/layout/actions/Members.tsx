import { IconButton, Link } from '@chakra-ui/react'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { Member, MemberLevel, MembershipType } from 'lib/models'
import { UpgradeIcon } from 'components/controls'

interface Props {
  member: Member
  active: boolean
  hasFeature: boolean
}

const MembersAction = ({ member, active, hasFeature }: Props) => {
  const level = MemberLevel[member?.user_type]
  if (level < MemberLevel.brother) {
    return <></>
  }

  if (!hasFeature) return <UpgradeIcon
    title='Member Directory'
    membershipType={MembershipType.Free}
    icon={<UserGroupIcon height="50px" width="50px" />}
  />
  
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
