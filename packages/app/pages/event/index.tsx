import { NextPageContext, GetServerSidePropsResult } from 'next'
import { EventDetail, GroupEvent, MemberLevel } from 'lib/models'
import Page from 'components/Page'
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  LinkBox,
  LinkOverlay,
  Heading,
} from '@chakra-ui/react'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { EventCard } from 'components/controls'
import { useUser } from 'hooks'
type Props = {
  events: (GroupEvent & { moment?: any })[]
}
export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await getServerSession(req as any, res, authOptions)
  const level = MemberLevel[session.user.user_type]
  if (!session || !session.user || level < MemberLevel.staff) {
    return {
      redirect: {
        destination: '/events',
        permanent: false,
      },
    }
  }

  const { listAdminEvents } = await import('lib/services/directus/server/events')
  const events = await listAdminEvents()
  return { props: { events } }
}

export default function AdminEventList({ events }: Props) {
  const { loading } = useUser()
  const eventList =
    events?.map((event) => {
      const date = new Date(new Date(event.datetime).toDateString())
      return {
        ...event,
        date,
      }
    }) || []
  const today = new Date(new Date().toDateString())
  const upcoming = eventList?.filter((event) => event.date > today)
  const past = eventList?.filter((event) => event.date < today)
  const activeEvent = eventList?.find((event) => Number(event.date) == Number(today))

  return (
    <Page title="Event Admin" requireAuth={true} loading={loading}>
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
                  <LinkOverlay as={Link} href={`/event/${activeEvent.id}`}>
                    View Event
                  </LinkOverlay>
                </EventCard>
              </LinkBox>
            </TabPanel>
          )}
          <TabPanel p={0}>
            <Heading mb={4}>Upcoming Events</Heading>
            {upcoming.map((event) => (
              <LinkBox key={event.id} cursor="pointer" mb={4}>
                <EventCard event={event} showDescription={false}>
                  <LinkOverlay as={Link} href={`/event/${event.id}`}>
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
                  <LinkOverlay as={Link} href={`/event/${event.id}`}>
                    View Event
                  </LinkOverlay>
                </EventCard>
              </LinkBox>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  )
}
