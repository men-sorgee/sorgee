import {
  ButtonLink,
  EventCard,
  EventRSVP,
  EventTicket,
  Lazy,
  MemberCard,
  MemberModal,
  Page,
  RateItem
} from "components";
import { isAfter, isToday } from "date-fns";
import { useEvent, useUser } from "hooks";
import {
  EventDetail,
  EventStats,
  EventUser,
  GroupEvent,
  Member,
  MemberLevel
} from "lib/models";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ArrowBackIcon } from "@chakra-ui/icons";
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
  useToast,
  Wrap
} from "@chakra-ui/react";

export default function EventPage() {
  const router = useRouter()
  const toast = useToast()
  const { id } = router.query
  const eventId = id ? String(id) : undefined
  const {
    member,
    isStaff,
    level,
    reload: reloadUser,
    hasFeature,
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
        isToday(new Date(event.datetime)) && !isAfter(new Date(), new Date(event.datetime_end))
      )
    }
    if (member?.events && !invite) {
      const i = member.events.find((e) => {
        let event = e.events_id as GroupEvent
        return event.id == eventId
      })
      setInvite(i)
    }
  }, [member, event, eventId, eventLoading, invite, member?.events, member?.id, stats])

  const getAttendees = (rsvp: string, filter = (u) => u) => {
    return event?.attendance
      ?.filter(filter)
      ?.filter((u) => u.rsvp == rsvp)
      .map(({ users_id: u, ...invite }: EventUser) => {
        return {
          user: u as Member,
          ...invite,
        }
      })
      .map(({ user: u, paid, guest }) => {
        const picture = u.picture as string
        const name = u.nickname || u.first_name || 'Brother'
        const src = picture ? '/api/asset/' + picture : undefined

        return {
          id: u.id,
          name,
          src,
          paid,
          guest,
        }
      })
  }

  const canViewAttendees = hasFeature('view_attendees')

  const UserAvatar = ({ id, name, src, paid, guest }) => (
    <>
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
              isClosable: true,
            })
        }}
      />
    </>
  )

  const canConfirm = member?.rating > 2 || level == MemberLevel.inductee
  const paidAttendees = getAttendees('confirmed', (u) => u.paid || u.guest)
  const confirmedAttendees = getAttendees('confirmed', (u) => !u.paid && !u.guest)
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
                        <StatLabel>Paid</StatLabel>
                        <StatNumber>{paidAttendees.length}</StatNumber>
                      </Stat>

                      <Wrap spacing={1} justify="end">
                        {paidAttendees.map((props, index) => (
                          <UserAvatar key={index} {...props} />
                        ))}
                      </Wrap>
                    </HStack>
                    <HStack align="start" justify="end">
                      <Stat>
                        <StatLabel>Confirmed</StatLabel>
                        <StatNumber>{confirmedAttendees.length}</StatNumber>
                      </Stat>

                      <Wrap spacing={1} justify="end">
                        {confirmedAttendees.map((props, index) => (
                          <UserAvatar key={index} {...props} />
                        ))}
                      </Wrap>
                    </HStack>

                    <HStack align="start" justify="right" mb={2}>
                      <Stat>
                        <StatLabel>Maybe</StatLabel>
                        <StatNumber>{stats.maybe_count}</StatNumber>
                      </Stat>

                      <Wrap spacing={1} justify="end">
                        {getAttendees('maybe').map((props, index) => (
                          <UserAvatar key={index} {...props} />
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
                    setMemberId={setMemberId}
                  />
                )}
                {event.status != 'occurred' && (invite || !event?.invite_only) && (
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
                size="lg"
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
  reloadUser,
  setMemberId,
}: {
  event: EventDetail
  member: Member
  invite: EventUser
  reloadUser: () => void
  setMemberId: (id: string) => void
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
          itemName="Event"
          item_id={event.id}
          collection="events"
          size="lg"
          aria-label={'Rate Event'}
        />
        <Spacer />
        {invite.attended &&
          event.surveys?.map((s) => (
            <ButtonLink key={s.id} size="md" href={`/survey/${s.id}/1`} colorScheme="accent">
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
              This is not a personal attraction rating, but a rating of their behavior and attitude
              at the event!
            </strong>
          </Alert>
          <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
            {attendees.map((m: Member) => (
              <Lazy key={event.id + '-' + m.id}>
                <MemberCard
                  viewer={member}
                  mb={4}
                  member={m}
                  mt={4}
                  size="lg"
                  onClick={() => {
                    setMemberId(m.id)
                  }}
                >
                  <Box maxW="60%" mx="auto" textAlign="center">
                    <RateItem
                      itemName="User"
                      onChange={() => {
                        reloadUser()
                      }}
                      size="sm"
                      item_id={m.id}
                      collection="users"
                      aria-label={'Rate this member'}
                      direction="row"
                      simple
                    >
                      <Heading as="h5" size="h4" m={0} p={0}>
                        Rate Him:
                      </Heading>
                    </RateItem>
                  </Box>
                </MemberCard>
              </Lazy>
            ))}
          </SimpleGrid>
        </>
      )}
    </>
  )
}
