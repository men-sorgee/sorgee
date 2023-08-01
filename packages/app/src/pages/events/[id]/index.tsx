import { useEffect, useState } from 'react'
import {
  ButtonLink,
  EventCard,
  EventRSVP,
  EventTicket,
  Lazy,
  MemberModal,
  MemberSpotlight,
  RateItem
} from 'components/controls'
import Page from 'components/Page'
import { isAfter, isToday } from 'date-fns'
import { useEvent, useUser } from 'hooks'
import {
  EventDetail,
  EventStats,
  EventUser,
  GroupEvent,
  Member,
  MemberLevel
} from 'lib/models'
import NextLink from 'next/link'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Spacer,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  Center,
  Wrap,
  Show,
  useToast
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function EventPage() {
  const router = useRouter()
  const toast = useToast()
  const { id } = router.query
  const eventId = String(id)
  const {
    member,
    isStaff,
    reload: reloadUser,
    hasFeature
  } = useUser({ minLevel: MemberLevel.inductee, redirectsEnabled: true })

  const [showTicket, setShowTicket] = useState<boolean>(false)

  const [stats, setStats] = useState<EventStats>(undefined)
  const [invite, setInvite] = useState<EventUser>(undefined)
  const [memberId, setMemberId] = useState<string>(undefined)

  const { event, loading: eventLoading } = useEvent(eventId)

  useEffect(() => {
    if (!eventLoading && event?.stats && stats == undefined) {
      setStats(event.stats)
      setShowTicket(
        isToday(new Date(event.datetime)) &&
          !isAfter(new Date(), new Date(event.datetime_end))
      )
    }
    if (member?.events && !invite) {
      const i = member.events.find((e) => {
        let event = e.events_id as GroupEvent
        return event.id == eventId
      })
      setInvite(i)
    }
  }, [event, eventId, eventLoading, invite, member?.events, member?.id, stats])

  const getAttendees = (rsvp: string) => {
    return event?.attendance
      ?.filter((u) => u.rsvp == rsvp)
      .map(({ users_id: u }: EventUser) => u as Member)
      .map((u) => {
        const picture = u.picture as string
        const name = u.nickname || u.first_name || 'Brother'
        const src = picture ? '/api/asset/' + picture : undefined
        return {
          id: u.id,
          name,
          src
        }
      })
  }

  const canViewAttendees = hasFeature('view_attendees')

  const canConfirm = member?.rating && member?.rating > 2
  return (
    <Page
      title={event?.name || 'Event Details'}
      description={event?.description}
      loading={eventLoading}
      hideHeader
      pt={2}
    >
      {event && (
        <>
          <EventCard
            event={event}
            showDescription={event.status != 'occurred'}
            showLocation={invite != undefined}
            showAddToCalendar={invite != undefined}
            isGuest={invite?.guest}
            isPaid={invite?.paid}
          >
            {member && (
              <>
                {showTicket && invite && invite.rsvp == 'confirmed' && (
                  <EventTicket event={event} member={member} />
                )}
                <Divider my={4} />
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
                  {stats && isStaff && (
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
                    </StatGroup>
                  )}
                </SimpleGrid>
                {stats && event.status != 'occurred' && invite && (
                  <Flex direction={'column'} gap={4} mb={2}>
                    <HStack align="start" justify="end">
                      <Stat>
                        <StatLabel>Confirmed</StatLabel>
                        <StatNumber>{stats.confirmed_count}</StatNumber>
                      </Stat>

                      <Wrap spacing={1} justify="end">
                        {getAttendees('confirmed').map(({ id, name, src }) => (
                          <Avatar
                            key={id}
                            name={name}
                            src={src}
                            title={name}
                            cursor="pointer"
                            onClick={() => {
                              if (canViewAttendees) {
                                if (invite?.rsvp == 'confirmed') setMemberId(id)
                              } else
                                toast({
                                  title: 'You cannot see attendee profiles',
                                  description:
                                    'Enable this feature with a subscription. Go to Account > Plan for more info.',
                                  status: 'error',
                                  duration: 5000,
                                  isClosable: true
                                })
                            }}
                          />
                        ))}
                      </Wrap>
                    </HStack>

                    <HStack align="start" justify="right" mb={2}>
                      <Stat>
                        <StatLabel>Maybe</StatLabel>
                        <StatNumber>{stats.maybe_count}</StatNumber>
                      </Stat>

                      <Wrap spacing={1} justify="end">
                        {getAttendees('maybe').map(({ id, name, src }) => (
                          <Avatar
                            key={id}
                            name={name}
                            src={src}
                            title={name}
                            cursor="pointer"
                            onClick={() => {
                              if (canViewAttendees) {
                                if (invite?.rsvp == 'confirmed') setMemberId(id)
                              } else
                                toast({
                                  title: 'You cannot see attendee profiles',
                                  description:
                                    'Enable this feature with a subscription. Go to Account > Plan for more info.',
                                  status: 'error',
                                  duration: 5000,
                                  isClosable: true
                                })
                            }}
                          />
                        ))}
                      </Wrap>
                    </HStack>
                  </Flex>
                )}
                {event.status == 'occurred' && invite?.attended && (
                  <AttendedEvent
                    event={event}
                    member={member}
                    invite={invite}
                    reloadUser={reloadUser}
                  />
                )}
                {event.status != 'occurred' &&
                  (invite || !event?.invite_only) && (
                    <EventRSVP canConfirm={canConfirm} eventId={eventId} />
                  )}
              </>
            )}
          </EventCard>
          {member && (
            <>
              <MemberModal
                isOpen={memberId != undefined}
                memberId={memberId}
                onClose={() => setMemberId(undefined)}
              />
              <HStack spacing={4} mt={4}>
                <Link as={NextLink} href="/events">
                  <ArrowBackIcon mr={2} w="50" />
                  Back to Events
                </Link>
                {isStaff && (
                  <Link as={NextLink} href={`/admin/event/${eventId}`} my={4}>
                    Event Admin
                  </Link>
                )}
              </HStack>
            </>
          )}
        </>
      )}
    </Page>
  )
}

const AttendedEvent = ({
  event,
  member,
  invite,
  reloadUser
}: {
  event: EventDetail
  member: Member
  invite: EventUser
  reloadUser: () => void
}) => {
  const attendees = event.attendance
    .filter((u) => u.attended)
    .map((u) => u.users_id as Member)
    .filter((u) => u.id != member.id)

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
        <RateItem
          item_id={event.id}
          collection="events"
          size="lg"
          aria-label={'Rate Event'}
        />
        <Spacer />
        {invite.attended &&
          event.surveys?.map((s) => (
            <ButtonLink
              key={s.id}
              size="md"
              href={`/survey/${s.id}/1`}
              colorScheme="accent"
            >
              {s.title}
            </ButtonLink>
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
          </Text>
          <Alert mb={4} rounded="lg" status="error">
            <AlertIcon />
            <strong>
              This is not a personal attraction rating, but a rating of their
              behavior and attitude at the event!
            </strong>
          </Alert>
          {attendees.map((m: Member) => (
            <Lazy key={event.id + '-' + m.id}>
              <MemberSpotlight size="xl" mb={4} memberId={m.id} mt={4}>
                <Center p={2}>
                  <Show above="md">
                    <Text>Your Rating:</Text>
                  </Show>
                  <RateItem
                    onChange={() => {
                      reloadUser()
                    }}
                    size="md"
                    item_id={m.id}
                    collection="users"
                    aria-label={'Rate this member'}
                    simple
                  ></RateItem>
                </Center>
              </MemberSpotlight>
            </Lazy>
          ))}
        </>
      )}
    </>
  )
}
