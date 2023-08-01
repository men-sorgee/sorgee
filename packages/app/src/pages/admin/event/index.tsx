import { EventCard } from 'components/controls'
import Page from 'components/Page'
import { useEventsAdmin, useUser } from 'hooks'
import { EventUser, GroupEvent, MemberLevel } from 'lib/models'
import Link from 'next/link'
import {
  Heading,
  LinkBox,
  LinkOverlay,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { isToday, isAfter } from 'date-fns'

export default function AdminEventList() {
  const [eventList, setEventsList] = useState<
    Array<GroupEvent & { date: Date }>
  >([])
  const { loading } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true
  })
  const { events, loading: eventsLoading } = useEventsAdmin()

  useEffect(() => {
    if (!eventsLoading && events && eventList.length == 0) {
      setEventsList(
        events?.map((event) => {
          const date = new Date(event.datetime)
          return {
            ...event,
            date
          }
        })
      )
    }
  }, [eventsLoading, events, eventList?.length])

  const today = new Date(new Date().toDateString())

  let upcoming = eventList?.filter((event) => isAfter(today, event.date))
  upcoming = upcoming.sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  })

  let past = eventList?.filter((event) => event.date < today)
  past = past.sort((a, b) => {
    return b.date.getTime() - a.date.getTime()
  })

  const activeEvent = eventList?.find((event) => isToday(event.date))

  const getCollected = (event: GroupEvent) => {
    const users = event.users as EventUser[]
    const attended = users?.filter((m) => m.attended == true).length
    const paid = users?.filter((m) => m.paid == true).length
    const collected = paid * event.cost
    return {
      attended,
      paid,
      collected
    }
  }

  return (
    <Page title="Event Admin" loading={loading}>
      <Tabs isFitted m={0}>
        <TabList>
          {activeEvent && <Tab>Active</Tab>}
          <Tab>Upcoming</Tab>
          <Tab>Past</Tab>
        </TabList>
        <TabPanels>
          {activeEvent && (
            <TabPanel p={0}>
              <LinkBox cursor="pointer" my={4}>
                <EventCard event={activeEvent} showDescription={false}>
                  <LinkOverlay
                    as={Link}
                    href={`/admin/event/${activeEvent.id}`}
                  >
                    View Event
                  </LinkOverlay>
                </EventCard>
              </LinkBox>
            </TabPanel>
          )}
          <TabPanel p={0}>
            <Heading mb={4}>Upcoming Events</Heading>
            {upcoming.map((event) => (
              <LinkBox
                key={event.id}
                cursor="pointer"
                mb={4}
                title="Click for event admin"
              >
                <EventCard event={event} showDescription={false}>
                  <LinkOverlay as={Link} href={`/admin/event/${event.id}`}>
                    View Event
                  </LinkOverlay>
                </EventCard>
              </LinkBox>
            ))}
          </TabPanel>
          <TabPanel p={0}>
            <Heading mb={4}>Past Events</Heading>
            {past.map((event) => (
              <LinkBox key={event.id} cursor="pointer" mb={4}>
                <EventCard event={event} showDescription={false}>
                  <LinkOverlay
                    as={Link}
                    href={`/admin/event/${event.id}`}
                  ></LinkOverlay>
                  <StatGroup>
                    <Stat>
                      <StatLabel>Attended</StatLabel>
                      <StatNumber>{getCollected(event).attended}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Paid</StatLabel>
                      <StatNumber>{getCollected(event).paid}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Collected</StatLabel>
                      <StatNumber>${getCollected(event).collected}</StatNumber>
                    </Stat>
                  </StatGroup>
                </EventCard>
              </LinkBox>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  )
}
