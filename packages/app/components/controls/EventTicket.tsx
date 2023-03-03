import { Flex, SlideFade, Text, Image, Link } from '@chakra-ui/react'
import { useState } from 'react'
import member from '../../pages/member'
type EventTicketProps = {
  member_id: string
  event_id: string
  invite_only: boolean
}
export const EventTicket = ({ member_id, event_id, invite_only }: EventTicketProps) => {
  const [showTicket, setShowTicket] = useState<boolean>(undefined)

  const checkinUrl = `/api/${
    invite_only ? 'invite' : 'events'
  }/checkin?user_id=${member_id}&event_id=${event_id}`
  return (
    <>
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
        <Flex direction="column">
          <Flex
            alignContent="center"
            justifyContent="center"
            align="center"
            bg="gray.200"
            color="white"
            mt={6}
            px={2}
            py={1}
            cursor="pointer"
            _hover={{ bg: 'primary' }}
            rounded="lg"
            onClick={() => setShowTicket(!showTicket)}
          >
            <Text color="white">{showTicket ? 'Hide' : 'Show'} Ticket</Text>
          </Flex>
          <SlideFade in={showTicket} unmountOnExit>
            <Text textAlign="center">
              <strong>Important:</strong> Present this ticket to the host when you arrive for
              access.
            </Text>
            <Image
              rounded="xl"
              shadow="lg"
              maxW="md"
              mt={4}
              mx="auto"
              src={`/api/code/${checkinUrl}`}
              alt="Ticket"
              w="full"
            />
          </SlideFade>
        </Flex>
      </div>
    </>
  )
}
