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
  Box,
  Text,
  Heading,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react'
import useSWR from 'swr'
import { EventCard, EventTicket, LinkButton, MemberSpotlight, RateItem } from 'components/controls'
import { EventDetail, EventStats, EventUser, Member, Rating, User } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser, useEvent } from 'hooks'
import { useRouter } from 'next/router'
import { isToday } from 'date-fns'
import { JsonFetcher } from '../../lib/utils'

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
  const { member, loading, reload: reloadUser } = useUser()
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
    }
    if (member?.events && !invite) {
      const i = member.events.find((e) => e.events_id == eventId)
      setInvite(i)
    }
  }, [event, eventId, eventLoading, invite, member?.events, member?.id, stats])

  const getAttendees = (rsvp: string) => {
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
      {member && event && (
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
          {stats && event.status != 'occurred' && (
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
          {invite?.attended && (
            <AttendedEvent event={event} member={member} invite={invite} reloadUser={reloadUser} />
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

const AttendedEvent = ({
  event,
  member,
  invite,
  reloadUser,
}: {
  event: EventDetail
  member: Member
  invite: EventUser
  reloadUser: () => void
}) => {
  const attendees = event.attendance
    .filter((u) => u.attended)
    .map((u) => u.users_id as User)
    .filter((u) => u.id != member.id)

  const color = useColorModeValue('gray.700', 'gray.200')

  return (
    <>
      <Divider mt={4} />
      <Heading as="h5" size="md">
        Rate Event:
      </Heading>
      <Flex
        mt={4}
        direction={['column', 'column', 'row']}
        gap={2}
        align="center"
        justify="space-between"
      >
        <RateItem item_id={event.id} collection="events" aria-label={'Rate Event'} />
        <Spacer />
        {invite.attended &&
          event.surveys?.map((s) => (
            <LinkButton key={s.id} size="md" href={`/survey/${s.id}/1`} colorScheme="accent">
              {s.title}
            </LinkButton>
          ))}
      </Flex>

      {attendees.length > 0 && (
        <>
          <Divider mt={4} />
          <Heading as="h5" size="md">
            Rate Attendees:
          </Heading>
          <Text ml={0} mb={2}>
            Rate the vibe and behavior of your fellow attendees to this event.
            <strong>
              This is not a personal attraction rating, but a rating of their behavior and attitude
              at the event!
            </strong>
          </Text>
          {attendees.map((u: User) => (
            <Box key={event.id + '-' + u.id} bg="gray.400" mb={4} rounded="lg">
              <MemberSpotlight size="md" id={u.id} full={false} color={color}>
                <RateItem
                  onChange={() => {
                    reloadUser()
                  }}
                  item_id={u.id}
                  collection="users"
                  aria-label={'Rate this member'}
                >
                  Rate
                </RateItem>
              </MemberSpotlight>
            </Box>
          ))}
        </>
      )}
    </>
  )
}
