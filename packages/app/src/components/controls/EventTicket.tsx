import { useState } from 'react'

import { EventDetail, GroupEvent, Member } from 'lib/models'

import { Box, Flex, Image, SlideFade, Text } from '@chakra-ui/react'

type EventTicketProps = {
  member: Member
  event: EventDetail | GroupEvent
  responsive?: boolean
}

export const EventTicket = ({
  member,
  event,
  responsive = false
}: EventTicketProps) => {
  const [showTicket, setShowTicket] = useState<boolean>(undefined)

  if (!member || !event) return null

  const checkinUrl = `/api/events/${event?.id}/checkin?user_id=${member?.id}`
  return (
    <>
      <Image
        className="print-only"
        rounded="xl"
        shadow="lg"
        maxW="sm"
        src={`/api/code${checkinUrl}`}
        alt="Ticket"
        w="full"
      />
      <div className="no-print">
        <Flex direction="column" pb={2}>
          <a href={`/api/code${checkinUrl}`}>
            <Image
              rounded="xl"
              shadow="lg"
              mx="auto"
              src={`/api/code${checkinUrl}`}
              alt="Ticket"
              w={responsive ? 'auto' : 'full'}
            />
          </a>
          <Text textAlign="center" m={0} p={0} fontSize={['sm', 'md']}>
            Admit: {member?.first_name} {member?.last_name}
          </Text>
        </Flex>
      </div>
    </>
  )
}
