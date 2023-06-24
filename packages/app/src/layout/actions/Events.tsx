import { useUserEvents } from 'hooks'
import { Member, MemberLevel } from 'lib/models'
import NextLink from 'next/link'

import { Badge, Icon, IconButton, Link } from '@chakra-ui/react'
import { CalendarIcon } from '@heroicons/react/24/outline'

interface Props {
  member: Member
  active: boolean
}

const EventsAction = ({ member, active }: Props) => {
  const level = MemberLevel[member?.user_type]
  const { newInvitationCount } = useUserEvents()
  if (level < MemberLevel.inductee) {
    return null
  }
  return (
    <>
      <Link href="/events" as={NextLink}>
        <IconButton
          variant="primary"
          zIndex="fixed"
          size={['sm', 'md', 'lg']}
          icon={
            <Icon
              as={CalendarIcon}
              w={['35px', '40px', '50px']}
              h={['35px', '40px', '50px']}
            />
          }
          color={active ? 'accent.500' : 'white'}
          aria-label={'Calendar'}
          title="Calendar"
        />
        {newInvitationCount > 0 && (
          <Badge
            ml={[-6, -8, -10]}
            zIndex="overlay"
            position="absolute"
            rounded="full"
            px={2}
            py={0.5}
            bg={active ? 'accent.500' : 'white'}
            color={active ? 'white' : 'accent.500'}
          >
            {newInvitationCount}
          </Badge>
        )}
      </Link>
    </>
  )
}

export default EventsAction
