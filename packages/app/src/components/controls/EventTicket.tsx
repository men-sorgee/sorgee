import { useState } from 'react'

import { EventDetail, GroupEvent, Member } from 'lib/models'

import { Box, Flex, Heading, Image, SlideFade, Text } from '@chakra-ui/react'

type EventTicketProps = {
  member: Member
  event: EventDetail | GroupEvent
  open?: boolean
}
export const EventTicket = ({
  member,
  event,
  open = false
}: EventTicketProps) => {
  const [showTicket, setShowTicket] = useState<boolean>(undefined)

  if (!member || !event) return null

  const checkinUrl = `/api/${
    event?.invite_only ? 'invite' : 'events'
  }/checkin?user_id=${member?.id}&event_id=${event?.id}`
  return (
    <Box p={2}>
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
        <Flex direction="column">
          {!open && (
            <Flex
              alignContent="center"
              justifyContent="center"
              align="center"
              bg="gray.200"
              color="white"
              cursor="pointer"
              _hover={{ bg: 'primary' }}
              rounded="lg"
              onClick={() => setShowTicket(!showTicket)}
            >
              <Text color="white" p={0} m={0}>
                {showTicket ? 'Hide' : 'Show'} Ticket
              </Text>
            </Flex>
          )}
          <SlideFade in={open || showTicket} unmountOnExit>
            <Text p={0} m={0} textAlign="center">
              Present this ticket to the host.
            </Text>

            <Image
              rounded="xl"
              shadow="lg"
              maxW="md"
              mx="auto"
              src={`/api/code${checkinUrl}`}
              alt="Ticket"
              w="full"
            />
            <Text textAlign="center" m={0} p={0}>
              Admit: {member?.first_name} {member?.last_name}
            </Text>
          </SlideFade>
        </Flex>
      </div>
    </Box>
  )
}
