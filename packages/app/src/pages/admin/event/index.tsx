import { ButtonLink, EventCard, Page } from "components";
import { useEventsAdmin, useUser } from "hooks";
import { EventUser, GroupEvent, MemberLevel } from "lib/models";

import {
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";

export default function AdminEventList() {
  const { loading } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true,
  })
  const { active: activeEvent, past, upcoming, loading: eventsLoading } = useEventsAdmin()

  const getCollected = (event: GroupEvent) => {
    const users = event.users as EventUser[]
    const attended = users?.filter((m) => m.attended == true).length
    const paid = users?.filter((m) => m.paid == true).length
    const collected = paid * event.cost - (event.expenses || 0)
    return {
      attended,
      paid,
      collected,
    }
  }

  return (
    <Page title="Event Admin" loading={loading || eventsLoading}>
      <Tabs isFitted m={0}>
        <TabList>
          {activeEvent && <Tab>Active</Tab>}
          <Tab>Upcoming</Tab>
          <Tab>Past</Tab>
        </TabList>
        <TabPanels>
          {activeEvent && (
            <TabPanel p={0}>

              <EventCard event={activeEvent} showDescription={false}>
                <ButtonLink my={2} href={`/admin/event/${activeEvent.id}`}>
                  View Event
                </ButtonLink>
              </EventCard>
            </TabPanel>
          )}
          <TabPanel p={0}>
            <Heading mb={4}>Upcoming Events</Heading>
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} showDescription={false}>
                <ButtonLink my={2} href={`/admin/event/${event.id}`}>
                  View Event
                </ButtonLink>
              </EventCard>
            ))}
          </TabPanel>
          <TabPanel p={0}>
            <Heading mb={4}>Past Events</Heading>
            {past.map((event) => (
              <EventCard key={event.id} size="md" event={event} showDescription={false} mb={4}>
                <ButtonLink my={2} href={`/admin/event/${event.id}`}>
                  View Event
                </ButtonLink>
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
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  )
}
