import { HStack, Stat, StatLabel, StatNumber, StatArrow, StatHelpText } from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/controls'
import { EventStats, MemberLevel } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser } from '../../../hooks'
import { useRouter } from 'next/router'
import { useEvent } from '../../../hooks/use-event'
import { NextPageContext } from 'next'
import { pruneUndefined } from '../../../lib/utils'
import { PageProps } from '../../calendar'

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  return {
    props: pruneUndefined({
      id: String(context.query.id),
    }),
  }
}

export default function EventPage({ id }: { id: string }) {
  const router = useRouter()
  const { id: i } = router.query
  const [eventId, setEventId] = useState<string>(id || i ? String(i) : undefined)
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
          <HStack spacing={4} align="start">
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
          </HStack>
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/member/events" my={4}>
          Back to Events
        </LinkButton>
      </HStack>
    </Page>
  )
}
