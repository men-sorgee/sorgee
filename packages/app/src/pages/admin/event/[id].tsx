import { use, useCallback, useEffect, useRef, useState } from 'react'
import { isPast, isFuture, isBefore } from 'date-fns'
import { ButtonLink, EventCard } from 'components/controls'
import Page from 'components/Page'
import { useEvent, useUser } from 'hooks'
import {
  EventDetail,
  EventStats,
  EventStatusType,
  Member,
  MemberLevel
} from 'lib/models'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { ArrowBackIcon, CheckIcon } from '@chakra-ui/icons'
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
  const {
    member,
    authorized,
    loading: userLoading
  } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true
  })

  const [fees, setFees] = useState<number>()
  const eventId = router.query.id as string
  const { event, loading: eventLoading, closeEvent } = useEvent(eventId)
  const [stats, setStats] = useState<EventStats>()
  const { error } = router.query
  const toast = useToast()
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

  const getAttendees = (rsvp: string) => {
    return event.attendance
      ?.filter((u) => u.rsvp == rsvp)

      .map((u) => {
        const user = u.users_id as Member
        const picture = user.picture as string
        const name = `${user.first_name} ${user.last_name} (${user.nickname})`
        const src = picture ? '/api/asset/' + picture : undefined
        return {
          id: u.id,
          name,
          rsvp: u.rsvp,
          attended: u.attended,
          src
        }
      })
  }
  const emailRef = useRef<HTMLInputElement>(null)
  const emailCheckin = () => {
    const email = emailRef.current.value
    if (email) {
      location.href = `/api/events/${event.id}/checkin?email=${email}`
    }
  }

  useEffect(() => {
    // do nothing
  }, [event, member])

  const closeEventClicked = useCallback(() => {
    closeEvent().then(
      ({ success, noShows }: { success: boolean; noShows: number }) => {
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
      }
    )
  }, [closeEvent, toast])

  const collected =
    event?.cost * event?.attendance.filter((a) => a.paid).length || 0

  return (
    <Page
      title={'Event Admin'}
      loading={userLoading && eventLoading}
      requireAuth={true}
      requiredLevel={MemberLevel.staff}
    >
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
            <Flex w="full" gap={3}>
              {event.status == EventStatusType.Scheduled &&
                isBefore(new Date(), new Date(event.datetime_end)) && (
                  <>
                    <ButtonLink
                      size="md"
                      colorScheme="primary"
                      href="/admin/scan"
                      color="white"
                    >
                      Scan Invite
                    </ButtonLink>
                    <Spacer />
                    <Input
                      rounded={'md'}
                      p={1}
                      w="30%"
                      name="email"
                      ref={emailRef}
                      size="sm"
                    />
                    <Button size={'sm'} onClick={() => emailCheckin()}>
                      Email Checkin
                    </Button>
                  </>
                )}
              <Spacer />

              {event.status == EventStatusType.Scheduled &&
                isPast(new Date(event.datetime_end)) && (
                  <Button bg="red.500" onClick={closeEventClicked}>
                    Close Event
                  </Button>
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
          <Heading as="h3" size="h3">
            Confirmed
          </Heading>
          <Wrap>
            {getAttendees('confirmed').map(({ id, name, src, attended }) => (
              <Box key={id} position="relative">
                <Avatar
                  opacity={attended ? 1 : 0.5}
                  name={name}
                  src={src}
                  title={name}
                />
                {attended && (
                  <CheckIcon
                    color="green"
                    boxSize={8}
                    position="absolute"
                    ml={-6}
                  />
                )}
              </Box>
            ))}
          </Wrap>
          <Heading as="h3" size="h3">
            Maybe
          </Heading>
          <Wrap>
            {getAttendees('maybe').map(({ id, name, src, attended }) => (
              <Box key={id} position="relative">
                <Avatar
                  key={id}
                  opacity={attended ? 1 : 0.5}
                  name={name}
                  src={src}
                  title={name}
                />
                {attended && <CheckIcon boxSize={6} />}
              </Box>
            ))}
          </Wrap>
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
