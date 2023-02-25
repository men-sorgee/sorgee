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
  Spacer,
  Flex,
} from '@chakra-ui/react'

import Page from 'components/Page'
import { useUser, useUserEvents } from 'hooks'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { EventUser, Member, GroupEvent, MemberLevel } from 'lib/models'
import { EventCard, EventRSVPCard, LinkButton, RateItem } from 'components/controls'

type Props = {}

function EventPage({}: Props) {
  const today = new Date(new Date().toDateString())

  const [allowed, setAllowed] = useState(false)
  const { member, loading, level } = useUser()
  const { invitations, upcoming, past, reload } = useUserEvents(member != null)

  useEffect(() => {
    if (!loading && member && !allowed) {
      setAllowed(level > MemberLevel.pledge)
    }
  }, [member, level, loading, allowed])

  const onEventsChange = useCallback(() => {
    reload()
  }, [reload])

  const activeEvent = upcoming.find(
    (invite: any) =>
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

                <Events
                  list={upcoming.filter((e) => e != activeEvent)}
                  member={member}
                  onChange={onEventsChange}
                  name="Upcoming Events"
                  text="Check back later for upcoming events."
                  showLink
                />
              </TabPanel>
              <TabPanel p={0}>
                <Heading mb={4}>Event Invitations</Heading>

                <Events
                  list={invitations}
                  member={member}
                  onChange={onEventsChange}
                  name="Invitations"
                  text="If you never see invitations, make sure
          your account is set to receive invites and that you never no-show to an event."
                />
              </TabPanel>

              <TabPanel p={0}>
                <Heading mb={4}>Past Events</Heading>
                <PastEvents list={past} />
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
  name,
  text,
  onChange,
  showLink = false,
}: {
  list: EventUser[]
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
      </Box>
    )
  }
  const items = list.map((invite) => {
    return {
      invite: invite as EventUser,
      event: invite.events_id as GroupEvent,
    }
  })
  return (
    <>
      {items.map(({ invite, event }) => (
        <EventRSVPCard
          key={invite.id}
          event={invite.events_id as GroupEvent}
          invite={invite}
          member={member}
          mb={8}
          onChange={onChange}
          href={showLink ? `/member/events/${event.id}` : null}
        />
      ))}
    </>
  )
}

function PastEvents({ list }: { list: EventUser[] }) {
  if (list.length === 0) {
    return null
  }

  const PastEventItem = ({ invite }: { invite: EventUser }) => {
    const event = invite.events_id as GroupEvent
    const surveyId = event.survey ? event.survey[0] : undefined
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
        <Flex mt={4} gap={4} align="end" justify="space-between">
          {(invite.attended && surveyId && (
            <LinkButton size="lg" href={`/survey/${surveyId}`} colorScheme="accent">
              Take the Survey
            </LinkButton>
          )) || <Spacer />}

          <RateItem item_id={event.id} collection="events" />
        </Flex>
      </Box>
    )
  }

  return (
    <>
      {list.map((invite) => (
        <EventCard
          key={invite.id}
          event={invite.events_id as GroupEvent}
          showDescription={false}
          mb={4}
        >
          <PastEventItem invite={invite} />
        </EventCard>
      ))}
    </>
  )
}

export default EventPage
