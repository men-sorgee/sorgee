import {
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  Flex,
  Divider,
  StatGroup,
  useBreakpointValue,
} from '@chakra-ui/react'
import { EventCard, EventTicket, LinkButton, MemberSpotlight } from 'components/controls'
import { EventStats, EventUser, User } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser, useEvent } from 'hooks'
import { useRouter } from 'next/router'
import { isToday } from 'date-fns'

export const getServerSideProps = (context) => {
  return {
    props: {
      id: context.params.id,
    },
  }
}

export default function EventPage({ id }) {
  const router = useRouter()
  const { id: i } = router.query
  const { member, loading } = useUser()
  const [eventId] = useState<string>(i || id)
  const [showTicket, setShowTicket] = useState<boolean>(false)
  const { event, loading: eventLoading } = useEvent(eventId)
  const [fees, setFees] = useState<number>(undefined)
  const [stats, setStats] = useState<EventStats>(undefined)
  const [invite, setInvite] = useState<EventUser>(undefined)
  useEffect(() => {
    if (!eventLoading && event?.stats && !stats) {
      setStats(event.stats)
      setShowTicket(isToday(new Date(event.datetime)))
      if (event.stats.attended_count) {
        setFees(event.stats.attended_count * event.cost)
      }
      let i = member.events.find((e) => e.events_id == event.id)
      if (i) {
        setInvite(i)
      }
    }
  }, [event, eventLoading, member?.events, stats])

  const getAttendees = (rsvp) => {
    return event?.attendance
      ?.filter((u) => u.rsvp == rsvp)
      .map(({ users_id: u }: EventUser) => u as User)
      .map((u) => {
        const picture = u.picture as string
        const name = u.nickname || u.first_name || 'Brother'
        const src = picture ? '/api/asset/' + picture : undefined
        return {
          id: u.id,
          name,
          src,
        }
      })
  }
  const showCount = useBreakpointValue([2, 4, 8, 10, 14])
  return (
    <Page title="Event Details" loading={loading || eventLoading} requireAuth={true}>
      {member && (
        <EventCard event={event} showDescription showLocation={true}>
          {showTicket && invite && invite.rsvp == 'confirmed' && (
            <EventTicket open event={event} member={member} />
          )}
          <Divider my={4} />
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            {stats && (
              <StatGroup>
                {event?.invite_only && stats.invited_count && (
                  <Stat>
                    <StatLabel>Invited</StatLabel>
                    <StatNumber>{stats.invited_count}</StatNumber>
                  </Stat>
                )}

                {stats.attended_count > 0 && (
                  <Stat>
                    <StatLabel>Attended</StatLabel>
                    <StatNumber>{stats.attended_count}</StatNumber>
                  </Stat>
                )}
                {stats.paid_count > 0 && (
                  <Stat>
                    <StatLabel>Paid</StatLabel>
                    <StatNumber>{stats.paid_count}</StatNumber>
                  </Stat>
                )}
                {stats.paid_count > 0 && fees > 0 && (
                  <Stat>
                    <StatLabel>Collected</StatLabel>
                    <StatNumber>${fees}</StatNumber>
                  </Stat>
                )}
              </StatGroup>
            )}
          </SimpleGrid>
          {stats && (
            <Flex direction="column" gap={4}>
              <HStack>
                <Stat>
                  <StatLabel>Confirmed</StatLabel>
                  <StatNumber>{stats.confirmed_count}</StatNumber>
                </Stat>
                <AvatarGroup size="md" max={showCount}>
                  {getAttendees('confirmed').map(({ id, name, src }) => (
                    <Avatar
                      key={id}
                      name={name}
                      src={src}
                      title={name}
                      cursor="pointer"
                      onClick={() => {
                        router.push('/members/' + id)
                      }}
                    />
                  ))}
                </AvatarGroup>
              </HStack>

              <HStack>
                <Stat>
                  <StatLabel>Maybe</StatLabel>
                  <StatNumber>{stats.maybe_count}</StatNumber>
                </Stat>
                <AvatarGroup size="md" max={showCount}>
                  {getAttendees('maybe').map(({ id, name, src }) => (
                    <Avatar
                      key={id}
                      name={name}
                      src={src}
                      title={name}
                      cursor="pointer"
                      onClick={() => {
                        router.push('/members/' + id)
                      }}
                    />
                  ))}
                </AvatarGroup>
              </HStack>
            </Flex>
          )}
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/events" my={4}>
          Back to Events
        </LinkButton>
      </HStack>
    </Page>
  )
}
