import { HStack, Stat, StatLabel, StatNumber, SimpleGrid } from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/controls'
import { EventStats } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser, useEvent } from 'hooks'
import { useRouter } from 'next/router'

export default function EventPage() {
  const router = useRouter()
  const { id } = router.query
  const [eventId] = useState<string>(String(id))
  const { event, loading: eventLoading } = useEvent(eventId)
  const { member, loading } = useUser()
  const [fees, setFees] = useState<number>(undefined)
  const [stats, setStats] = useState<EventStats>(undefined)

  useEffect(() => {
    if (!eventLoading && event?.stats && !stats) {
      setStats(event.stats)
      if (event.stats.attended_count) {
        setFees(event.stats.attended_count * event.cost)
      }
    }
  }, [event, eventLoading, stats])
  return (
    <Page title={event ? event.name : 'Event'} loading={loading || eventLoading} requireAuth={true}>
      {member && (
        <EventCard event={event} showDescription>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            {stats && (
              <>
                {stats.invited_count && (
                  <Stat>
                    <StatNumber>{stats.invited_count}</StatNumber>
                    <StatLabel>Invited</StatLabel>
                  </Stat>
                )}
                <Stat>
                  <StatNumber>{stats.confirmed_count}</StatNumber>
                  <StatLabel>Confirmed</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>{stats.maybe_count}</StatNumber>
                  <StatLabel>Maybe</StatLabel>
                </Stat>
                {stats.attended_count > 0 && (
                  <Stat>
                    <StatNumber>{stats.attended_count}</StatNumber>
                    <StatLabel>Attended</StatLabel>
                  </Stat>
                )}
                {stats.paid_count > 0 && (
                  <Stat>
                    <StatNumber>{stats.paid_count}</StatNumber>
                    <StatLabel>Paid</StatLabel>
                  </Stat>
                )}
                {stats.paid_count > 0 && fees > 0 && (
                  <Stat>
                    <StatNumber>${fees}</StatNumber>
                    <StatLabel>Collected</StatLabel>
                  </Stat>
                )}
              </>
            )}
          </SimpleGrid>
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/member/invites" my={4}>
          Back to Invites
        </LinkButton>
      </HStack>
    </Page>
  )
}
