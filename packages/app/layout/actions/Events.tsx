import { useUserEvents } from 'hooks'
import { Member } from 'lib/models'
import NextLink from 'next/link'

import { Badge, IconButton, Link } from '@chakra-ui/react'
import { CalendarIcon } from '@heroicons/react/24/outline'

interface Props {
  member: Member
  active: boolean
}

const EventsAction = ({ active }: Props) => {
  const { newInvitationCount } = useUserEvents()

  return (
    <>
      <Link href="/events" as={NextLink}>
        <IconButton
          variant="primary"
          zIndex="fixed"
          size="lg"
          icon={<CalendarIcon height="50px" width="50px" />}
          color={active ? 'accent.500' : 'white'}
          aria-label={'Calendar'}
          title="Calendar"
        />
        {newInvitationCount > 0 && (
          <Badge
            ml={-4}
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
