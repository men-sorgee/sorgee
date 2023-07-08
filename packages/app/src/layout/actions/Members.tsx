import { UpgradeIcon } from 'components/controls'
import { Member, MemberLevel, MembershipType } from 'lib/models'
import NextLink from 'next/link'

import { Icon, IconButton, Link } from '@chakra-ui/react'
import { UserGroupIcon } from '@heroicons/react/24/outline'

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

  if (!hasFeature)
    return (
      <UpgradeIcon
        title="Member Directory"
        membershipType={MembershipType.free}
        icon={
          <Icon
            as={UserGroupIcon}
            width={['35px', '40px', '50px']}
            height={['35px', '40px', '50px']}
          />
        }
        size={['sm', 'md', 'lg']}
      />
    )

  return (
    <>
      <Link href="/members" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          size={['sm', 'md', 'lg']}
          icon={
            <Icon
              as={UserGroupIcon}
              w={['35px', '40px', '50px']}
              h={['35px', '40px', '50px']}
            />
          }
          zIndex="fixed"
          color={active ? 'accent.500' : 'white'}
          aria-label={'View Members'}
          title="View Members"
        />
      </Link>
    </>
  )
}

export default MembersAction
