import {
  Box,
  Heading,
  Text,
  AlertIcon,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useUser, useUserEvents } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { EventUser, Member, GroupEvent } from 'lib/models'
import { EventCard, EventRSVPCard } from 'components/controls'

type Props = {}

function EventPage({}: Props) {
  const today = new Date(new Date().toDateString())

  const [allowed, setAllowed] = useState(false)
  const { member, loading, level } = useUser()
  const { invitations, upcoming, past, reload } = useUserEvents(member != null)

  useEffect(() => {
    if (!loading && member && !allowed) {
      setAllowed(level > 2)
    }
  }, [member, level, loading, allowed])

  const onEventsChange = useCallback(() => {
    reload()
  }, [reload])

  const activeEvent = upcoming.find(
    (invite) =>
      new Date(new Date(invite.events_id.datetime).toDateString()).getTime() == today.getTime()
  )

  return (
    <Page loading={loading} title="Your Events" description="Upcoming events." requireAuth={true}>
      {allowed ? (
        <>
          <Tabs isFitted m={0}>
            <div className="no-print">
              <TabList>
                {activeEvent && <Tab className="no-print">Active</Tab>}
                <Tab className="no-print">Upcoming</Tab>
                <Tab className="no-print">
                  Invitations
                  {invitations.length > 0 && (
                    <Badge ml={1} bg="red.500" rounded="full" px={2} py={0.5} color="white">
                      {invitations.length}
                    </Badge>
                  )}
                </Tab>
                <Tab className="no-print">Past</Tab>
              </TabList>
            </div>
            <TabPanels>
              {activeEvent && (
                <TabPanel p={0}>
                  <Heading mb={4} className="no-print">
                    Active Event
                  </Heading>
                  <EventRSVPCard member={member} event={activeEvent.events_id as GroupEvent} full />
                </TabPanel>
              )}
              <TabPanel p={0}>
                <Heading mb={4}>Upcoming Events</Heading>
                {(upcoming.length && (
                  <Events
                    list={upcoming.filter((e) => e != activeEvent)}
                    member={member}
                    onChange={onEventsChange}
                  />
                )) || (
                  <Box>
                    <Heading as="h3" size="md">
                      No Upcoming Events
                    </Heading>
                  </Box>
                )}
              </TabPanel>
              <TabPanel p={0}>
                <Heading mb={4}>Event Invitations</Heading>
                {(invitations.length && (
                  <Events list={invitations} member={member} onChange={onEventsChange} />
                )) || (
                  <Box>
                    <Heading as="h3" size="md">
                      No Invites
                    </Heading>
                    <Text>
                      Check back later for upcoming events. If you never see invitations, make sure
                      your account is set to receive invites and that you never no-show to an event.
                    </Text>
                  </Box>
                )}
              </TabPanel>

              <TabPanel p={0}>
                <Box>
                  <Heading mb={4}>Past Events</Heading>
                  {(past.length &&
                    past.map((invite) => (
                      <EventCard
                        key={invite.id}
                        event={invite.events_id as GroupEvent}
                        showDescription={false}
                        mb={4}
                      >
                        <PastEventInfo
                          key={invite.id}
                          invite={invite}
                          event={invite.events_id as GroupEvent}
                        />
                      </EventCard>
                    ))) || (
                    <Heading as="h3" size="md">
                      No Past Events
                    </Heading>
                  )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <Box>
          <Heading>Nothing to see here</Heading>
          <Text>
            Please complete your <Link href="/apply">membership application</Link>.
          </Text>
        </Box>
      )}
    </Page>
  )
}

function Events({
  list,
  member,
  onChange,
}: {
  list: EventUser[]
  member: Member
  onChange: () => void
}) {
  if (list.length === 0) {
    return null
  }

  return (
    <>
      {member &&
        list.map((invite) => (
          <EventRSVPCard
            key={invite.id}
            event={invite.events_id as GroupEvent}
            invite={invite}
            member={member}
            mb={4}
            onChange={onChange}
          />
        ))}
    </>
  )
}

function PastEventInfo({ invite, event }: { invite: EventUser; event: GroupEvent }) {
  return (
    <Box>
      <h5>
        RSVP: {invite.rsvp.toUpperCase()} | {invite.attended ? 'You attended!' : 'Did not attend'}
      </h5>
      {!invite.attended && invite.rsvp == 'confirmed' && (
        <Alert status="warning" rounded="lg" mt={4}>
          <AlertIcon />
          You did not show up, despite being confirmed.
        </Alert>
      )}
      {invite.attended && invite.rsvp == 'invited' && (
        <Alert status="warning" rounded="lg" mt={4}>
          <AlertIcon />
          You showed up, but did not RSVP.
        </Alert>
      )}
    </Box>
  )
}

export default EventPage
