import { useState } from 'react'

import { EventDetail, GroupEvent, Member } from 'lib/models'

import { Box, Flex, Heading, Image, SlideFade, Text } from '@chakra-ui/react'

type EventTicketProps = {
  member: Member
  event: EventDetail | GroupEvent
  open?: boolean
}
export const EventTicket = ({ member, event, open = false }: EventTicketProps) => {
  const [showTicket, setShowTicket] = useState<boolean>(undefined)

  if (!member || !event) return null

  const checkinUrl = `/api/${event?.invite_only ? 'invite' : 'events'}/checkin?user_id=${
    member?.id
  }&event_id=${event?.id}`
  return (
    <Box mt={4} borderTop="2px dotted">
      <Image
        className="print-only"
        rounded="xl"
        shadow="lg"
        maxW="sm"
        mt={-8}
        src={`/api/code${checkinUrl}`}
        alt="Ticket"
        w="full"
      />
      <div className="no-print">
        <Text textAlign="center">
          <strong>Important:</strong> Present this ticket to the host when you arrive for access.
        </Text>
        <Flex direction="column" my={4}>
          {!open && (
            <Flex
              alignContent="center"
              justifyContent="center"
              align="center"
              bg="gray.200"
              color="white"
              px={2}
              py={2}
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
            <Heading textAlign="center" mb={0}>
              Admit: {member?.first_name} {member?.last_name}
            </Heading>

            <Image
              rounded="xl"
              shadow="lg"
              maxW="md"
              mt={4}
              mx="auto"
              src={`/api/code${checkinUrl}`}
              alt="Ticket"
              w="full"
            />
            <Text textAlign="center" my={1} color="gray.200">
              U: {member?.id}
              <br />
              e: {event?.id}
            </Text>
          </SlideFade>
        </Flex>
      </div>
    </Box>
  )
}
