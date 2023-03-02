import {
  Box,
  Heading,
  Divider,
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
  useColorModeValue,
} from '@chakra-ui/react'
import { isToday } from 'date-fns'
import Page from 'components/Page'
import { useUser, useUserEvents } from 'hooks'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { EventUser, Member, GroupEvent, MemberLevel } from 'lib/models'
import {
  EventCard,
  EventRSVPCard,
  LinkButton,
  MemberSpotlight,
  RateItem,
} from 'components/controls'

export type PageProps = {}

export default function EventsPage({}: PageProps) {
  const [allowed, setAllowed] = useState(false)
  const { member, loading, level, reload: reloadUser } = useUser()
  const { invitations, upcoming, past, reload } = useUserEvents()

  useEffect(() => {
    if (!loading && member && !allowed) {
      setAllowed(level > MemberLevel.pledge)
    }
  }, [member, level, loading, allowed])

  const onEventsChange = useCallback(() => {
    reload()
  }, [reload])

  const activeEvent = upcoming.find((invite: any) => isToday(new Date(invite.events_id.datetime)))

  return (
    <Page loading={loading} title="Your Events" description="Upcoming events." requireAuth={true}>
      {allowed ? (
        <>
          <Tabs isFitted m={0} isLazy>
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
                <PastEvents member={member} list={past} reloadUser={reloadUser} />
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
      {items.map(({ invite }) => (
        <EventRSVPCard
          key={invite.id}
          event={invite.events_id as GroupEvent}
          invite={invite}
          member={member}
          mb={8}
          onChange={onChange}
        />
      ))}
    </>
  )
}

function PastEvents({
  member,
  list,
  reloadUser,
}: {
  list: EventUser[]
  member: Member
  reloadUser: () => void
}) {
  if (list.length === 0 || !member?.ratings?.length) {
    return null
  }

  const ratedUserIds =
    member.ratings.filter((r) => r.collection == 'users').map((r) => r.member as string) || []

  const PastEventItem = ({ invite }: { invite: EventUser }) => {
    const event = invite.events_id as GroupEvent
    const surveyId = event.survey ? event.survey[0] : undefined
    const users = event.users as EventUser[]
    const attendees = users
      .filter((u) => u.attended)
      .map((u) => u.users_id as string)
      .filter((u) => !ratedUserIds.includes(u))

    const color = useColorModeValue('gray.700', 'gray.200')

    return (
      <Box key={invite.id}>
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
        <Flex mt={4} gap={4} align="start" justify="space-between">
          <Heading as="h5" size="md" m={0}>
            Rate Event:
          </Heading>
          <RateItem item_id={event.id} collection="events" />
          <Spacer />
          {invite.attended && surveyId && (
            <LinkButton size="lg" href={`/survey/${surveyId}`} colorScheme="accent">
              Take the Survey
            </LinkButton>
          )}
        </Flex>

        {attendees.length > 0 && (
          <>
            <Divider my={4} />
            <Heading as="h5" size="md" m={0}>
              Rate Attendees:
            </Heading>
          </>
        )}

        {attendees.map((u: string) => (
          <Box key={event.id + '-' + u} bg="gray.400" mb={4} rounded="lg">
            <MemberSpotlight id={u} full={false} color={color}>
              <RateItem
                onChange={() => {
                  reloadUser()
                }}
                item_id={u}
                collection="users"
              />
            </MemberSpotlight>
          </Box>
        ))}
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
