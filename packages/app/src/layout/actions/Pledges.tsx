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
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useMemberSearch } from '../../hooks'

interface Props {
  member: Member
  active: boolean
}

const PledgesAction = ({ member, active }: Props) => {
  const level = MemberLevel[member?.user_type]

  const { meta } = useMemberSearch(1, 20, 'last_login', {
    user_type: MemberLevel[MemberLevel.pledge]
  })
  const { filtered: count } = meta

  if (level < MemberLevel.brother) {
    return null
  }

  return (
    <>
      <Link href="/members/pledges" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          zIndex="fixed"
          size={['sm', 'md', 'lg']}
          icon={
            <Icon
              as={UserCircleIcon}
              w={['35px', '40px', '50px']}
              h={['35px', '40px', '50px']}
            />
          }
          color={active ? 'accent.500' : 'white'}
          aria-label="Review Pledges"
          title="Review Pledges"
        />
        {count > 0 && (
          <Badge
            bg={'accent.500'}
            color={'white'}
            ml={[-6, -8, -10]}
            zIndex="overlay"
            position="absolute"
            rounded="full"
            px={2}
            py={0.5}
          >
            {count}
          </Badge>
        )}
      </Link>
    </>
  )
}

export default PledgesAction
