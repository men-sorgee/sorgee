import {
  Alert,
  HStack,
  Flex,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/controls'
import { EventDetail, EventStats, MemberLevel } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser } from '../../../hooks'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
  const { getEventDetail } = await import('lib/services/directus/server/events')
  const eventId = String(context.query.id)
  if (!eventId) {
    return {
      notFound: true,
    }
  }
  const event = await getEventDetail(eventId)
  if (!event) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      event,
    },
  }
}

export default function EventAdmin({ event }: { event: EventDetail }) {
  const router = useRouter()

  const { member, authorized, loading } = useUser(MemberLevel.staff)
  const { id, error } = router.query
  const [fees, setFees] = useState<number>(undefined)
  const [stats] = useState<EventStats>(event.stats)

  useEffect(() => {
    //if (!loading && member) {
    //  if (!authorized) {
    //    router.push(`/events/${event?.id}`)
    //  }
    //}
    if (event.stats && !fees) {
      setFees(event.stats.paid_count * event.cost)
    }
  }, [authorized, event, fees, loading, member, router, stats])

  return (
    <Page
      title={event ? event.name + ' Admin' : 'Loading'}
      loading={loading}
      requireAuth={true}
      requiredLevel={MemberLevel.staff}
    >
      {member && event && (
        <EventCard event={event} showDescription={false}>
          <Flex direction="column" gap={4}>
            {error && (
              <Alert status="error" size="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Flex>
          <SimpleGrid columns={[2, 4, 6]} spacing={4} mb={4}>
            {stats && (
              <>
                {stats.invited_count && (
                  <Stat>
                    <StatLabel>Invited</StatLabel>
                    <StatNumber>{stats.invited_count}</StatNumber>
                  </Stat>
                )}
                <Stat>
                  <StatLabel>Confirmed</StatLabel>
                  <StatNumber>{stats.confirmed_count}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Maybe</StatLabel>
                  <StatNumber>{stats.maybe_count}</StatNumber>
                </Stat>

                {stats.attended_count != undefined && (
                  <Stat>
                    <StatLabel>Attended</StatLabel>
                    <StatNumber>{stats.attended_count}</StatNumber>
                  </Stat>
                )}
                {stats.paid_count != undefined && (
                  <Stat>
                    <StatLabel>Paid</StatLabel>
                    <StatNumber>{stats.paid_count}</StatNumber>
                  </Stat>
                )}
                {fees != undefined && (
                  <Stat>
                    <StatLabel>Collected</StatLabel>
                    <StatNumber>${fees}</StatNumber>
                  </Stat>
                )}
              </>
            )}
          </SimpleGrid>
          {stats && (
            <Flex direction="column" gap={4}>
              <HStack></HStack>

              <HStack></HStack>
            </Flex>
          )}
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/admin/event" my={4}>
          Back to Events
        </LinkButton>

        <LinkButton colorScheme="primary" href="/admin/scan" my={4}>
          Scan Invite
        </LinkButton>
      </HStack>
    </Page>
  )
}
