import { Badge, IconButton, Link } from '@chakra-ui/react'
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { useUserEvents } from 'hooks'
import { Member } from 'lib/models'
import path from 'path'

interface Props {
  member: Member
  active: boolean
}

const MembersAction = ({ active, member }: Props) => {
  const { newInvitationCount } = useUserEvents()

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

        {newInvitationCount > 0 && (
          <Badge
            ml={-4}
            zIndex="overlay"
            position="absolute"
            bg="accent.500"
            rounded="full"
            px={2}
            py={0.5}
            color="white"
          >
            {newInvitationCount}
          </Badge>
        )}
      </Link>
    </>
  )
}

export default MembersAction
