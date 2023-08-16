import {
  ButtonConfirm,
  ButtonLink,
  EventCard,
  MemberAvatar,
  Page
} from "components";
import { isPast } from "date-fns";
import { useEvent, useUser } from "hooks";
import {
  EventDetail,
  EventStats,
  EventStatusType,
  EventUser,
  InviteRSVPType,
  Member,
  MemberLevel
} from "lib/models";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { ArrowBackIcon, CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast
} from "@chakra-ui/react";

import { getAssetUrl } from "../../../lib/utils";

export default function EventAdmin() {
  const router = useRouter()
  const toast = useToast()
  const { id } = router.query
  const eventId = id ? String(id) : undefined
  const {
    member,
    authorized,
    loading: userLoading,
  } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true,
  })
  const { event, loading: eventLoading, closeEvent, reload } = useEvent(eventId, true)
  const [email, setEmail] = useState<string>(undefined)
  const [fees, setFees] = useState<number>()
  const [stats, setStats] = useState<EventStats>()
  const [collected, setCollected] = useState<number>(0)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!eventLoading && event && event.stats && !fees) {
      setFees(event.stats.paid_count * event.cost)
      setStats(event.stats)
    }
  }, [authorized, event, eventLoading, fees, userLoading, member, router, stats])

  const getCheckinLink = (email: string) => {
    if (email) {
      return `/api/events/${event?.id}/checkin?email=${email}`
    }
    return '/admin/events/' + event?.id
  }

  useEffect(() => {
    if (!eventLoading && event && event.attendance) {
      setCollected(event?.cost * event?.attendance.filter((a) => a.paid).length || 0)
    }
  }, [event, event?.attendance, member, eventLoading])

  const confirmedAttendees = getAttendees(event?.attendance, 'confirmed', email)
  const maybeAttendees = getAttendees(event?.attendance, 'maybe', email)

  return (
    <Page title={'Event Admin'} loading={userLoading || eventLoading}>
      {member && event && (
        <EventCard
          event={event}
          showDescription={false}
          footer={
            <Flex direction={['column', 'column', 'row']} w="full" gap={2} justify="stretch">
              {event.status == EventStatusType.Scheduled && isPast(new Date(event.datetime)) && (
                <ButtonConfirm
                  bg="red.500"
                  color="white"
                  confirmedAction={closeEvent}
                  alertTitle="Close"
                  onSuccess={(success) => {
                    if (success) {
                      toast({
                        title: 'Event Closed',
                        description:
                          'The event has been closed. No shows were rated and notified. A survey was created for the event, along with a notification for each of the attendees.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
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
          <Flex direction={['column', 'row']} gap={2} justify="space-between" w="full">
            {/**<ButtonLink size={['sm', 'md', 'lg']} href="/admin/scan" w="full">
              Scan
                </ButtonLink>
            <Spacer w={[0, 40, 800]} />**/}
            <Flex gap={1} w={'full'} justify="stretch">
              <Input
                type="email"
                rounded="md"
                p={1}
                name="email"
                ref={emailRef}
                size={['sm', 'md', 'lg']}
                required
                placeholder="Email Address"
                w="full"
                flexGrow={1}
                tabIndex={0}
                onChange={(e) => setEmail(e.target.value)}
                defaultValue={email}
              />
              <ButtonLink
                w={'full'}
                href={getCheckinLink(emailRef?.current?.value)}
                size={['sm', 'md', 'lg']}
                flexGrow={1}
              >
                Checkin
              </ButtonLink>
            </Flex>
          </Flex>
          <UserList
            title="Confirmed"
            attendees={confirmedAttendees}
            event={event}
            reload={reload}
          />
          <UserList title="Maybe" attendees={maybeAttendees} event={event} reload={reload} />
        </EventCard>
      )}
      <HStack spacing={4} my={4}>
        <Link as={NextLink} href="/admin/event">
          <ArrowBackIcon mr={2} w={'50'} />
          Back to Events
        </Link>
        <Link as={NextLink} href={`/events/${event?.id}`}>
          Event Details
        </Link>
      </HStack>
    </Page>
  )
}

type InvitedUser = {
  id: number
  name: string
  rsvp: InviteRSVPType
  attended: boolean
  email: string
  src: string
  user: Partial<Member>
}

const getAttendees = (attendance: EventUser[], rsvp: string, email?: string): InvitedUser[] => {
  let results =
    attendance
      ?.filter((u) => u.rsvp == rsvp)
      .map((u) => {
        const user = u.users_id as Partial<Member>
        const picture = user.picture as string
        const name = `${user.first_name || ''} ${user.last_name || ''}`
        const src = getAssetUrl(picture)
        const email = user.email
        return {
          id: u.id,
          name,
          rsvp: u.rsvp,
          attended: u.attended,
          email,
          src,
          user,
        } as InvitedUser
      }) || []
  if (email) {
    results = results.filter((u) => u.email.includes(email))
  }
  return results
}

const UserList = ({
  title,
  attendees,
  event,
  reload,
}: {
  title: string
  attendees: InvitedUser[]
  event: EventDetail
  reload: () => void
}) => {
  if (attendees.length == 0) return null
  return (
    <>
      <Heading as="h3" size="h3" title="Reload" onClick={() => reload} cursor="pointer">
        {title}
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {attendees.map(({ id, name, src, attended, email, user }, index) => (
          <HStack
            key={index}
            as="div"
            border="1px dotted"
            borderColor="primary"
            rounded="md"
            p={2}
            maxWidth="full"
            overflow="hidden"
            position="relative"
            align="center"
          >
            <MemberAvatar member={user} opacity={attended ? 1 : 0.5} name={name} src={src} />
            <Box as="strong" fontSize="xs">
              <Text title={name} mt={0}>
                {name}
              </Text>
              <Link title={email} href={`mailto:${email}`} color="text" mb={1}>
                {email}
              </Link>
              <Spacer />
              {!attended && (
                <ButtonLink
                  as='a'
                  variant="solid"
                  title={attended ? name : `Click to check ${name} in`}
                  href={`/api/events/${event.id}/checkin?user_id=${user.id}`}
                  size="xs"
                >
                  CHECK-IN
                </ButtonLink>
              ) || <ButtonLink
                as='a'
                variant="solid"
                title={attended ? name : `Click to view ${name} check-in`}
                href={`/admin/event/invite/${id}`}
                size="xs"
              >
                  REVIEW
                </ButtonLink>}
            </Box>

            {attended && (
              <CheckIcon color="green" boxSize={5} position="absolute" right={2} top={0} />
            )}
          </HStack>
        ))}
      </SimpleGrid>
    </>
  )
}
