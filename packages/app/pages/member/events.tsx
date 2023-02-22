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
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useUser, useUserEvents } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { EventUser, Member, GroupEvent } from 'lib/models'
import { EventCard, EventRSVPCard } from 'components/controls'

type Props = {}

function EventPage({}: Props) {
  const [allowed, setAllowed] = useState(false)
  const { member, loading, level } = useUser()
  const { invites, reload } = useUserEvents(member != null)

  useEffect(() => {
    if (!loading && member && !allowed) {
      setAllowed(level > 2)
    }
  }, [member, level, loading, allowed])

  const onEventsChange = useCallback(() => {
    reload()
  }, [reload])

  const invitations = invites?.filter((i) => i.rsvp == 'invited')
  const upcoming = invites?.filter((i) => i.rsvp != 'invited' && i.events_id.status == 'scheduled')
  const past = invites?.filter((i) => i.attended && i.events_id.status == 'occurred')

  return (
    <Page loading={loading} title="Your Events" description="Upcoming events." requireAuth={true}>
      {allowed ? (
        <>
          <Tabs isFitted>
            <TabList>
              <Tab>Upcoming Events</Tab>
              <Tab>Invitations</Tab>
              <Tab>Past Events</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {(invitations.length && (
                  <Events invites={upcoming} member={member} onChange={onEventsChange} />
                )) || (
                  <Box>
                    <Heading>No Upcoming Events</Heading>
                  </Box>
                )}
              </TabPanel>
              <TabPanel>
                {(invitations.length && (
                  <Events invites={invitations} member={member} onChange={onEventsChange} />
                )) || (
                  <Box>
                    <Heading>No Invites</Heading>
                    <Text>
                      Check back later for upcoming events. If you never see invitations, make sure
                      your account is set to receive invites and that you never no-show to an event.
                    </Text>
                    <Text>
                      If you confirm attendance to an event and then do not show up, you may be
                      removed from future invite lists. If you stop getting invites and think this
                      might have happened, you can contact the event organizers to appeal your
                      removal.
                    </Text>
                  </Box>
                )}
              </TabPanel>

              <TabPanel>
                <Box>
                  {(past.length &&
                    past.map((invite) => (
                      <EventCard
                        key={invite.id}
                        event={invite.events_id as GroupEvent}
                        member={member}
                        mb={4}
                      >
                        <PastEventInfo
                          key={invite.id}
                          invite={invite}
                          event={invite.events_id as GroupEvent}
                        />
                      </EventCard>
                    ))) || <Heading>No Past Events</Heading>}
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
  invites,
  member,
  onChange,
}: {
  invites: EventUser[]
  member: Member
  onChange: () => void
}) {
  if (invites?.length === 0) {
    return null
  }

  return (
    <>
      {member &&
        invites?.map((invite) => (
          <EventRSVPCard
            key={invite.id}
            event={invite.events_id as GroupEvent}
            invite={invite}
            member={member}
            mb={4}
            onChange={onChange}
            full
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
        <Alert status="warning">
          <AlertIcon />
          You did not show up, despite being confirmed.
        </Alert>
      )}
      {invite.attended && invite.rsvp == 'invited' && (
        <Alert status="warning">
          <AlertIcon />
          You showed up, but did not RSVP.
        </Alert>
      )}
    </Box>
  )
}

export default EventPage
