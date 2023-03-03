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
  SlideFade,
} from '@chakra-ui/react'
import { isToday } from 'date-fns'
import Page from 'components/Page'
import { useUser, useUserEvents } from 'hooks'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { EventUser, Member, GroupEvent, MemberLevel, EventInvite } from 'lib/models'
import {
  EventCard,
  EventRSVPCard,
  EventTicket,
  LinkButton,
  MemberSpotlight,
  RateItem,
} from 'components/controls'

export type PageProps = {}

export default function EventsPage({}: PageProps) {
  const [allowed, setAllowed] = useState(false)
  const { member, loading, level, reload: reloadUser } = useUser()
  const { invitations, newInvitationCount, upcoming, past, reload } = useUserEvents()

  useEffect(() => {
    if (!loading && member && !allowed) {
      setAllowed(level > MemberLevel.pledge)
    }
  }, [member, level, loading, allowed])

  const onEventsChange = useCallback(() => {
    reload()
  }, [reload])

  const activeEvent = upcoming.find((invite: EventInvite) =>
    isToday(new Date(invite.event.datetime))
  )

  return (
    <Page loading={loading} title="Events" description="Upcoming events." requireAuth={true}>
      {allowed ? (
        <>
          <Tabs isFitted m={0} isLazy>
            <div className="no-print">
              <TabList>
                {activeEvent && <Tab className="no-print">Active</Tab>}
                <Tab className="no-print">Upcoming</Tab>
                <Tab className="no-print">
                  Invitations
                  {newInvitationCount > 0 && (
                    <Badge ml={1} bg="red.500" rounded="full" px={2} py={0.5} color="white">
                      {newInvitationCount}
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
                  <EventRSVPCard member={member} invite={activeEvent}>
                    <EventTicket
                      event_id={activeEvent.event.id}
                      member_id={member.id}
                      invite_only={activeEvent.event.invite_only}
                    />
                  </EventRSVPCard>
                </TabPanel>
              )}
              <TabPanel p={0}>
                <Heading mb={4}>Your Upcoming Events</Heading>

                <Invitations
                  list={upcoming.filter((e) => e != activeEvent)}
                  member={member}
                  onChange={onEventsChange}
                  name="Upcoming Events"
                  text="Check back later for upcoming events."
                />
              </TabPanel>
              <TabPanel p={0}>
                <Heading mb={4}>You&apos;re Invited</Heading>

                <Invitations
                  list={invitations}
                  member={member}
                  onChange={onEventsChange}
                  name="Invitations"
                  text="If you never see invitations, make sure
          your account is set to receive invites and that you never no-show to an event."
                />
              </TabPanel>

              <TabPanel p={0}>
                <Heading mb={4}>Your Past Events</Heading>
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

function Invitations({
  list,
  member,
  name,
  text,
  onChange,
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
      </Box>
    )
  }

  list.sort((a, b) => {
    const dateA = new Date(a.event.datetime).getTime()
    const dateB = new Date(b.event.datetime).getTime()
    return dateA - dateB
  })

  return (
    <>
      {list.map((invite, index) => (
        <EventRSVPCard
          key={index}
          invite={invite}
          member={member}
          mb={8}
          full={false}
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
  list: EventInvite[]
  member: Member
  reloadUser: () => void
}) {
  if (list.length === 0 || !member?.ratings?.length) {
    return null
  }

  const ratedUserIds =
    member.ratings.filter((r) => r.collection == 'users').map((r) => r.member as string) || []

  const PastEventItem = ({ invite }: { invite: EventInvite }) => {
    const event = invite.event
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
          event={invite.event as GroupEvent}
          showDescription={false}
          mb={4}
        >
          <PastEventItem invite={invite} />
        </EventCard>
      ))}
    </>
  )
}
