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
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Stat,
  StatGroup,
  StatHelpText,
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
  const [prePaid, setPrePaid] = useState<number>()
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
      setCollected(event?.cost * (event?.stats.paid_count - event?.stats.prepaid_count) || 0)
      setPrePaid(event.cost * event?.stats.prepaid_count || 0)
    }
  }, [event, event?.attendance, member, eventLoading])

  const confirmedAttendees = getAttendees(event?.attendance, 'confirmed', email)
  const maybeAttendees = getAttendees(event?.attendance, 'maybe', email)

  const attendees = event?.attendance?.filter((a) => a.attended).map(mapUser) || []
  const noShows = event?.attendance?.filter((a) => !a.attended && a.rsvp == 'confirmed').map(mapUser) || []

  const expensesRef = useRef<HTMLInputElement>(null)
  return (
    <Page title={'Event Admin'} loading={userLoading || eventLoading}>
      {member && event && (
        <EventCard
          event={event}
          showDescription={false}
          footer={
            <Flex direction={['column', 'column', 'row']} w="full" gap={2} justify="stretch">
              {event.status == EventStatusType.Scheduled && isPast(new Date(event.datetime_end)) && (
                <ButtonConfirm
                  bg="red.500"
                  color="white"
                  confirmedAction={() => {
                    return closeEvent(Number(expensesRef?.current?.value) || 0)
                  }}
                  alertTitle="Close Event"
                  successMessage='The event has been closed. No shows were rated and notified. A survey was created for the event, along with a notification for each of the attendees.'
                  failureMessage="Event could not be closed."
                  buttonText="Close Out Event"
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
                    <Box borderColor="text" my={2}>
                      <FormLabel>
                        Expenses:
                      </FormLabel>
                      <NumberInput />
                      <NumberInput name='expenses' placeholder="00.00" ref={expensesRef} defaultValue={60} max={300} clampValueOnBlur={false} step={20}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>

                  </>
                </ButtonConfirm>
              )}
            </Flex>
          }
        >
          {stats && (
            <>
              <StatGroup gap={4} justifyItems='space-between' alignItems="center">

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
                    <StatHelpText>
                      {Math.floor(stats.attended_count / stats.confirmed_count) * 100}%
                    </StatHelpText>
                  </Stat>
                )}
                {stats.paid_count != undefined && (
                  <Stat>
                    <StatLabel>Paid Cash</StatLabel>
                    <StatNumber>{stats.cash_count}</StatNumber>
                    <StatHelpText>
                      {Math.floor(stats.cash_count / stats.paid_count) * 100}%
                    </StatHelpText>
                  </Stat>
                )}
                {stats.prepaid_count != undefined && (
                  <Stat>
                    <StatLabel>Paid Online</StatLabel>
                    <StatNumber>{stats.prepaid_count}</StatNumber>
                    <StatHelpText>
                      {Math.floor(stats.prepaid_count / stats.paid_count) * 100}%
                    </StatHelpText>
                  </Stat>
                )}
              </StatGroup>
            </>
          )}
          <Flex direction={['column', 'row']} gap={2} justify="space-between" w="full">
            <ButtonLink size={['sm', 'md', 'lg']} href="/admin/scan" w="full">
              Scan
            </ButtonLink>
            <Spacer w={[0, 40, 800]} />
            {event?.status == 'scheduled' && <Flex gap={1} w={'full'} justify="stretch">
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
            }
          </Flex>
          <Box my={4} borderY="2px dotted" borderColor="text" pb={8}>
            {event?.status == 'scheduled' && <UserList
              title="Confirmed"
              attendees={confirmedAttendees}
              event={event}
              reload={reload}
            />}
            {event?.status == 'scheduled' && <UserList title="Maybe" attendees={maybeAttendees} event={event} reload={reload} />}
            {event?.status == 'occurred' && <UserList
              title="Attended"
              attendees={attendees}
              event={event}
              reload={reload}
            />}
            {event?.status == 'occurred' && <UserList
              title="No Shows"
              attendees={noShows}
              event={event}
              reload={reload}
            />}
          </Box>
          {event?.status == EventStatusType.Occurred && (
            <StatGroup>
              {stats?.prepaid_count != undefined && (<>
                <Stat>
                  <StatLabel>Collected Online</StatLabel>
                  <StatNumber fontSize="xxx-large">${prePaid}</StatNumber>
                  <StatHelpText>
                    ${event?.cost} x {stats?.prepaid_count} Online
                  </StatHelpText>
                </Stat>
                <Stat>

                  <StatNumber fontSize="xxx-large">+</StatNumber>
                </Stat>
              </>)}
              <Stat>
                <StatLabel>Collected Cash</StatLabel>
                <StatNumber fontSize="xxx-large">${collected}</StatNumber>
                <StatHelpText>
                  ${event?.cost} x {stats?.cash_count} Cash
                </StatHelpText>
              </Stat>
              {event?.expenses && (<>
                <Stat>

                  <StatNumber fontSize="xxx-large">-</StatNumber>

                </Stat>
                <Stat>
                  <StatLabel>Expenses</StatLabel>
                  <StatNumber fontSize="xxx-large">${event?.expenses || 0}</StatNumber>
                  <StatHelpText>
                    Supplies
                  </StatHelpText>
                </Stat>
              </>)}
              {stats?.prepaid_count != undefined && (<>
                <Stat>
                  <StatNumber fontSize="xxx-large">=</StatNumber>
                </Stat>
              </>)}
              <Stat>
                <StatLabel>Total</StatLabel>
                <StatNumber fontSize="xxx-large">${fees - (event?.expenses || 0)}</StatNumber>
                <StatHelpText>
                  ${event?.cost} x {stats?.paid_count} {event?.expenses && <> - ${event?.expenses} </>}
                </StatHelpText>
              </Stat>
            </StatGroup>


          )}
        </EventCard>
      )
      }
      <HStack spacing={4} my={4}>
        <Link as={NextLink} href="/admin/event">
          <ArrowBackIcon mr={2} w={'50'} />
          Back to Events
        </Link>
        <Link as={NextLink} href={`/events/${event?.id}`}>
          Event Details
        </Link>
      </HStack>
    </Page >
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

const mapUser = (u: EventUser) => {
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
}

const getAttendees = (attendance: EventUser[], rsvp: string, email?: string): InvitedUser[] => {
  let results =
    attendance
      ?.filter((u) => u.rsvp == rsvp)
      .map(mapUser)
    || []
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
      <Heading as="h3" size="h3" title="Reload" mt={4} onClick={() => reload} cursor="pointer">
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
              {event.status == 'scheduled' && (<>

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
                  </ButtonLink>
                }
              </>
              )}
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
