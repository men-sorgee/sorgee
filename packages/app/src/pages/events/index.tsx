import { useCallback, useState } from 'react'

import { capitalCase } from 'change-case'
import {
  ButtonLink,
  EventBadge,
  EventCard,
  EventRSVP,
  EventTicket,
  Lazy
} from 'components/controls'
import Page from 'components/Page'
import { addDays, isAfter, isSameDay, isToday } from 'date-fns'
import { useUser, useUserEvents } from 'hooks'
import { brand } from 'lib/config/brand'
import { EventInvite, GroupEvent, Member, MemberLevel } from 'lib/models'
import Link from 'next/link'
import Calendar from 'react-calendar'

import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Heading,
  Flex,
  LinkBox,
  LinkOverlay,
  Show,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

export type PageProps = {}

export default function EventsPage({}: PageProps) {
  const [tabValue, setTabValue] = useState(0)
  const { member, loading, authorized } = useUser({
    minLevel: MemberLevel.inductee,
    redirectsEnabled: true
  })
  const {
    invitations,
    newInvitationCount,
    upcoming,
    past,
    reload,
    loading: eventsLoading,
    activeInvite
  } = useUserEvents()

  const onEventsChange = useCallback(() => {
    reload()
  }, [reload])
  const canConfirm = member?.rating && member?.rating > 2

  return (
    <Page
      loading={loading || eventsLoading}
      title="Events"
      description="Upcoming events."
      requireAuth={true}
      hideHeader
      pt={2}
    >
      {authorized ? (
        <>
          {activeInvite && member && (
            <Box mb={4}>
              <EventCard
                key={activeInvite.id}
                event={activeInvite.event as GroupEvent}
                showDescription={false}
                isGuest={activeInvite.guest}
                isPaid={activeInvite.paid}
                mb={4}
                showAddToCalendar={false}
                showLocation={true}
                hideBody={false}
              >
                <ButtonLink
                  gradient={true}
                  rounded="lg"
                  w="full"
                  colorScheme="primary"
                  href={`/events/${activeInvite.event.id}`}
                  p={6}
                  flex={1}
                >
                  View Details
                </ButtonLink>

                <EventRSVP
                  canConfirm={canConfirm}
                  memberId={member?.id}
                  eventId={activeInvite.event.id}
                  rsvp={activeInvite.rsvp}
                  onChange={onEventsChange}
                />
                <ButtonLink
                  gradient={true}
                  rounded="lg"
                  w="full"
                  colorScheme="secondary"
                  href={`/events/${activeInvite.event.id}/ticket`}
                  p={6}
                  flex={1}
                  mt={4}
                >
                  View Ticket
                </ButtonLink>
              </EventCard>
            </Box>
          )}
          <EventCalendar
            events={[...upcoming, ...invitations].map((i) => i.event)}
          />

          {!canConfirm && (
            <Alert status="warning" rounded="lg" shadow="lg" my={4}>
              <AlertIcon />
              You cannot confirm events. Your reputation for attending events is
              too low. Showing up to events you RSVP to will improve your
            </Alert>
          )}

          <Tabs
            isFitted
            variant="enclosed"
            defaultIndex={tabValue}
            onChange={(index) => setTabValue(index)}
            isLazy
            size={['sm', 'lg']}
          >
            <div className="no-print">
              <TabList>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 0 ? 'bold' : null}
                >
                  Upcoming
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 1 ? 'bold' : null}
                >
                  Invitations
                  {newInvitationCount > 0 && (
                    <Badge
                      ml={1}
                      bg="red.500"
                      rounded="full"
                      px={2}
                      py={0.5}
                      color="white"
                    >
                      {newInvitationCount}
                    </Badge>
                  )}
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 2 ? 'bold' : null}
                >
                  Past
                </Tab>
              </TabList>
            </div>
            <TabPanels>
              <TabPanel p={0}>
                <Heading mb={4}>Your Upcoming Events</Heading>

                <Invitations
                  list={upcoming.filter((e) => e != activeInvite)}
                  member={member}
                  onChange={onEventsChange}
                  name="Upcoming Events"
                  showLink={true}
                  text="Check back later for upcoming events."
                />
              </TabPanel>
              <TabPanel p={0}>
                <Heading mb={4}>Your Invitations</Heading>
                <Invitations
                  list={invitations}
                  member={member}
                  onChange={onEventsChange}
                  name="Invitations"
                  text={
                    invitations.length == 0 &&
                    'If you never see invitations, make sure your account is set to receive invites and that you never no-show to an event.'
                  }
                />
              </TabPanel>

              <TabPanel p={0}>
                <Heading mb={4}>Your Past Events</Heading>
                <PastEvents member={member} list={past} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <Box>
          <Heading>No Events</Heading>
          <Text>
            You cannot see or attend events yet. Once you have completed the
            application and vetting process, events will show up here.
          </Text>
        </Box>
      )}
    </Page>
  )
}

function Invitations({
  list,
  member,
  name,
  text,
  onChange,
  showLink = false
}: {
  list: EventInvite[]
  member: Member
  name: string
  text?: string
  onChange: () => void
  showLink?: boolean
}) {
  if (list.length === 0) {
    return (
      <Box>
        <Heading as="h3" size="md">
          No {name}
        </Heading>
        <Text>{text}</Text>
        {member?.event_invites == false && (
          <Alert mt={4} status="warning" rounded="lg" shadow="lg">
            <AlertIcon />
            You have event invitations turned off. Update&nbsp;
            <Link href="/member/settings">your event settings</Link>&nbsp; to
            change that.
          </Alert>
        )}
      </Box>
    )
  }

  list.sort((a, b) => {
    const dateA = new Date(a.event.datetime).getTime()
    const dateB = new Date(b.event.datetime).getTime()
    return dateA - dateB
  })
  if (!member) return null
  const canConfirm = member?.rating && member?.rating > 2
  return (
    <>
      {list.map((invite, index) => {
        return (
          <Lazy key={invite.id}>
            <EventCard
              mb={8}
              event={invite.event}
              showDescription={false}
              showLocation={false}
              isGuest={invite.guest || false}
              isPaid={invite.paid || false}
              showAddToCalendar={
                invite.rsvp == 'confirmed' || invite.rsvp == 'maybe'
              }
            >
              {showLink && (
                <ButtonLink
                  gradient={true}
                  rounded="lg"
                  w="full"
                  colorScheme="primary"
                  href={`/events/${invite.event.id}`}
                  p={6}
                  color="white"
                >
                  View Details
                </ButtonLink>
              )}
              <EventRSVP
                canConfirm={canConfirm}
                memberId={member.id}
                eventId={invite.event.id}
                rsvp={invite.rsvp}
                onChange={onChange}
                mt={4}
              />
            </EventCard>
          </Lazy>
        )
      })}
    </>
  )
}

function PastEvents({ member, list }: { list: EventInvite[]; member: Member }) {
  if (list.length === 0 || !member) {
    return (
      <Box>
        <Heading as="h3" size="md">
          No Past Events
        </Heading>
      </Box>
    )
  }

  list.sort((a, b) => {
    const dateA = new Date(a.event.datetime).getTime()
    const dateB = new Date(b.event.datetime).getTime()
    return dateB - dateA
  })

  const PastEventItem = ({ invite }: { invite: EventInvite }) => {
    return (
      <Box key={invite.id} pt={4}>
        <ButtonLink
          gradient={true}
          rounded="lg"
          w="full"
          colorScheme="primary"
          href={`/events/${invite.event.id}`}
          p={6}
          color="white"
        >
          Rate Event &amp; Attendees
        </ButtonLink>

        <Heading as="h3" size="h3" textAlign="center">
          {capitalCase(invite.rsvp)} and{' '}
          {invite.attended ? 'attended!' : 'did not attend'}
        </Heading>
        {!invite.attended && invite.rsvp == 'confirmed' && (
          <Alert status="warning" rounded="lg" mt={4} textAlign="center">
            <AlertIcon />
            You did not show up, despite being confirmed.
          </Alert>
        )}
        {invite.attended && invite.rsvp == 'invited' && (
          <Alert status="warning" rounded="lg" mt={4} textAlign="center">
            <AlertIcon />
            You showed up, but did not RSVP.
          </Alert>
        )}
      </Box>
    )
  }

  return (
    <>
      {list.map((invite) => (
        <Lazy key={invite.id}>
          <EventCard
            event={invite.event as GroupEvent}
            showDescription={false}
            mb={4}
            showAddToCalendar={false}
          >
            <PastEventItem invite={invite} />
          </EventCard>
        </Lazy>
      ))}
    </>
  )
}

function EventCalendar({ events }: { events: GroupEvent[] }) {
  const today = new Date()
  const minDate = today
  const maxDate = addDays(today, 120)
  const [value, setValue] = useState(today)
  const onChange = useCallback((value: Date) => {
    setValue(value)
  }, [])

  const linkColor = useColorModeValue('primary.500', 'primary.200')
  const EventView = ({ event }: { event: GroupEvent; full?: boolean }) => {
    return (
      <LinkBox color={linkColor}>
        <EventBadge type={event.type} status={event.status} />
        <div>
          {event.name}
          <LinkOverlay href={`/events/${event.id}`} />
        </div>
      </LinkBox>
    )
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (!events?.length) return null
    // Add class to tiles in month view only
    if (view === 'month') {
      const event: GroupEvent = events
        ? events?.find((e: GroupEvent, i: any) =>
            isSameDay(new Date(e.datetime), date)
          )
        : null
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      return (
        <Box p={0} height="full" width="full">
          {event && <EventView event={event} />}{' '}
        </Box>
      )
    }
  }

  const line = useColorModeValue(brand.colors.primary[700], '#000')
  const bg = useColorModeValue('#FFF', brand.colors.gray[300])
  const lineWeekend = useColorModeValue(brand.colors.gray[300], '#FFF')
  const bgWeekend = useColorModeValue(
    brand.colors.gray[100],
    brand.colors.gray[400]
  )

  return (
    <Show above="md">
      <Box
        my={4}
        css={{
          '.react-calendar ': {
            width: '100%',
            minH: '50vh',

            margin: '2rem auto 0 auto'
          },
          '.react-calendar abbr': {
            textDecoration: 'none'
          },
          '.react-calendar__navigation': {
            backgroundColor: line,
            color: 'white',
            padding: '0 .5em',
            display: 'flex',
            borderRadius: '15px 15px 0 0',
            fontWeight: 'bold',
            fontSize: '2.5em',
            gap: '1rem'
          },
          '.react-calendar__tile': {
            minHeight: '100px',
            borderColor: line,
            border: '1px solid',
            margin: '0',
            color: line,
            cursor: 'default'
          },
          '.react-calendar__tile--active': {
            fontWeight: 'bold',
            border: '4px dashed',
            borderColor: brand.colors.accent[500]
          },
          '.react-calendar__month-view__days__day': {
            backgroundColor: bg
          },

          '.react-calendar__month-view__days__day--weekend': {
            backgroundColor: bgWeekend,
            color: lineWeekend,
            borderColor: line
          },
          '.react-calendar__month-view': {
            borderColor: line,
            borderStyle: 'solid',
            borderWidth: '1px 1px 20px 1px',
            borderRadius: '0 0 15px 15px',
            backgroundColor: line
          },
          '.react-calendar__month-view__weekdays': {
            backgroundColor: line,
            color: 'white',
            textTransform: 'uppercase'
          },
          '.react-calendar__month-view__weekdays__weekday': {
            padding: '0.5em',
            textAlign: 'center'
          },
          'react-calendar__month-view__days': {
            justifyContent: 'end'
          }
        }}
      >
        <Calendar
          className="calendar"
          value={value}
          onChange={onChange}
          tileContent={tileContent}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Box>
    </Show>
  )
}
