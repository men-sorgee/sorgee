import { useInvites } from 'hooks'
import { Member, MemberLevel } from 'lib/models'
import NextLink from 'next/link'

import { Badge, Box, Icon, IconButton, Link } from '@chakra-ui/react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { TicketIcon } from '@heroicons/react/24/outline'

interface Props {
  member: Member
  active: boolean
  iconSize?: string[]
  iconDimensions?: string[]
}

const EventsAction = ({ member, active, iconSize, iconDimensions }: Props) => {
  const level = MemberLevel[member?.user_type]
  const { newInvitationCount, activeInvite } = useInvites()
  if (level < MemberLevel.inductee) {
    return null
  }
  return (
    <Box>
      <Link href="/events" as={NextLink}>
        <IconButton
          variant="primary"
          zIndex="fixed"
          size={iconSize}
          w={iconDimensions}
          icon={
            <Icon as={CalendarIcon} w={iconDimensions} h={iconDimensions} />
          }
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
      {activeInvite && (
        <Link href={`/events/${activeInvite.event.id}/ticket`} as={NextLink}>
          <IconButton
            variant="primary"
            zIndex="fixed"
            size={iconSize}
            icon={
              <Icon as={TicketIcon} w={iconDimensions} h={iconDimensions} />
            }
            w={iconDimensions}
            color="yellow.500"
            aria-label={`Ticket to ${activeInvite.event.name}`}
            title={`Ticket to ${activeInvite.event.name}`}
          />
        </Link>
      )}
    </Box>
  )
}

export default EventsAction
