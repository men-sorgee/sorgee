import { Flex, SlideFade, Text, Image, Box, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { Member, GroupEvent, EventDetail } from 'lib/models'

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
            <Heading textAlign="center" m={0}>
              Admit: {member?.first_name} {member?.last_name}
            </Heading>
            <Text textAlign="center" m={0}>
              <br />
              U: {member?.id}
              <br />
              e: {event?.id}
            </Text>

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
            {location.hostname === 'localhost' && (
              <input value={checkinUrl} style={{ width: '100%' }} />
            )}
            <Text textAlign="center">
              <strong>Important:</strong> Present this ticket to the host when you arrive for
              access.
            </Text>
          </SlideFade>
        </Flex>
      </div>
    </Box>
  )
}
