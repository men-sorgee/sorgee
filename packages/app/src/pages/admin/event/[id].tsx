import { use, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { isPast, isFuture, isBefore } from 'date-fns'
import {
  ButtonConfirm,
  ButtonLink,
  EventCard,
  MemberAvatar
} from 'components/controls'
import Page from 'components/Page'
import { useEvent, useUser } from 'hooks'
import {
  EventDetail,
  EventStats,
  EventStatusType,
  EventUser,
  Member,
  MemberLevel
} from 'lib/models'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getAssetUrl } from 'lib/utils'
import { ArrowBackIcon, CheckCircleIcon, CheckIcon } from '@chakra-ui/icons'

import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast,
  Wrap
} from '@chakra-ui/react'

export default function EventAdmin() {
  const router = useRouter()
  const toast = useToast()
  const { id, error } = router.query
  const eventId = String(id)
  const {
    member,
    authorized,
    loading: userLoading
  } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true
  })
  const { event, loading: eventLoading, closeEvent } = useEvent(eventId, true)
  const [fees, setFees] = useState<number>()
  const [stats, setStats] = useState<EventStats>()
  const [collected, setCollected] = useState<number>(0)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!eventLoading && event && event.stats && !fees) {
      setFees(event.stats.paid_count * event.cost)
      setStats(event.stats)
    }
  }, [
    authorized,
    event,
    eventLoading,
    fees,
    userLoading,
    member,
    router,
    stats
  ])

  const getCheckinLink = (email: string) => {
    if (email) {
      return `/api/events/${event?.id}/checkin?email=${email}`
    }
    return '/admin/events/' + event?.id
  }

  useEffect(() => {
    if (!eventLoading && event && event.attendance) {
      setCollected(
        event?.cost * event?.attendance.filter((a) => a.paid).length || 0
      )
    }
  }, [event, event?.attendance, member, eventLoading])

  const confirmedAttendees = getAttendees(event?.attendance, 'confirmed')
  const maybeAttendees = getAttendees(event?.attendance, 'maybe')

  return (
    <Page title={'Event Admin'} loading={userLoading || eventLoading}>
      {error && (
        <Alert status="error" size="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {member && event && (
        <EventCard
          event={event}
          showDescription={false}
          footer={
            <Flex
              direction={['column', 'column', 'row']}
              w="full"
              gap={2}
              justify="stretch"
            >
              {event.status == EventStatusType.Scheduled &&
                isBefore(new Date(), new Date(event.datetime_end)) && (
                  <>
                    <ButtonLink
                      size="md"
                      colorScheme="primary"
                      href="/admin/scan"
                      color="white"
                      w={['full', 'auto']}
                    >
                      Scan
                    </ButtonLink>
                    <Spacer />
                    <HStack spacing={1} w={['full', 'fit-content']}>
                      <Input
                        type="email"
                        rounded="full"
                        p={1}
                        name="email"
                        ref={emailRef}
                        size={['sm', 'md']}
                        required
                        placeholder="Email Address"
                        flex={1}
                      />
                      <ButtonLink
                        w={'auto'}
                        href={getCheckinLink(emailRef?.current?.value)}
                        size={['sm', 'md']}
                      >
                        Checkin
                      </ButtonLink>
                    </HStack>
                  </>
                )}
              <Spacer />

              {event.status == EventStatusType.Scheduled &&
                isPast(new Date(event.datetime)) && (
                  <ButtonConfirm
                    bg="red.500"
                    color="white"
                    promise={closeEvent}
                    alertTitle="Close"
                    complete={(success) => {
                      if (success) {
                        toast({
                          title: 'Event Closed',
                          description:
                            'The event has been closed. No shows were rated and notified. A survey was created for the event, along with a notification for each of the attendees.',
                          status: 'success',
                          duration: 5000,
                          isClosable: true
                        })
                      }
                    }}
                    successMessage="Event Closed"
                    failureMessage="Event could not be closed."
                    buttonText="Close"
                  >
                    <>
                      <Heading as="h4" size="md" mt={0}>
                        Are you sure you want to close this event out?
                      </Heading>
                      <Text>This will perform the following:</Text>
                      <List>
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          Set the status of the event to occurred.
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          Create a survey for the event.
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          Create a notification for each attendee.
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          Create a notification for each no-show.
                        </ListItem>
                      </List>
                    </>
                  </ButtonConfirm>
                )}
            </Flex>
          }
        >
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
                {event?.status == EventStatusType.Occurred && (
                  <Stat>
                    <StatLabel>Total Fees</StatLabel>
                    <StatNumber>${collected}</StatNumber>
                  </Stat>
                )}
              </>
            )}
          </SimpleGrid>
          <UserList
            title="Confirmed"
            attendees={confirmedAttendees}
            event={event}
          />
          <UserList title="Maybe" attendees={maybeAttendees} event={event} />
        </EventCard>
      )}
      <HStack spacing={4} my={4}>
        <Link as={NextLink} href="/admin/event">
          <ArrowBackIcon mr={2} w="50" />
          Back to Events
        </Link>
        <Link as={NextLink} href={`/events/${event?.id}`}>
          Event Details
        </Link>
      </HStack>
    </Page>
  )
}

const getAttendees = (attendance: EventUser[], rsvp: string) => {
  return (
    attendance
      ?.filter((u) => u.rsvp == rsvp)
      .map((u) => {
        const user = u.users_id as Member
        const picture = user.picture as string
        const name = `${user.first_name} ${user.last_name} (${user.nickname})`
        const src = getAssetUrl(picture)
        const email = user.email
        return {
          id: u.id,
          name,
          rsvp: u.rsvp,
          attended: u.attended,
          email,
          src,
          user
        }
      }) || []
  )
}

const UserList = ({ title, attendees, event }) => {
  if (attendees.length == 0) return null
  return (
    <>
      <Heading as="h3" size="h3">
        {title}
      </Heading>
      <Wrap>
        {attendees.map(({ id, name, src, attended, email, user }) => (
          <Flex
            key={id}
            as="div"
            direction="column"
            align="center"
            position="relative"
            maxW="50px"
            cursor={attended ? 'default' : 'pointer'}
            title={attended ? name : `Click to check ${name} in`}
          >
            <Link
              as={NextLink}
              href={
                attended
                  ? `/admin/event/${event.id}`
                  : `/api/events/${event.id}/checkin?email=${email}`
              }
            >
              <MemberAvatar
                member={user}
                opacity={attended ? 1 : 0.5}
                name={name}
                src={src}
              />
            </Link>
            {attended && (
              <CheckIcon
                color="green"
                boxSize={8}
                position="absolute"
                ml={-6}
              />
            )}
            <Box as="strong" fontSize="xs">
              {name}
            </Box>
          </Flex>
        ))}
      </Wrap>
    </>
  )
}
