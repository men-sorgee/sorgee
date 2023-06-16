import { EventCard } from 'components/controls'
import Page from 'components/Page'
import { useUser } from 'hooks'
import { GroupEvent, MemberLevel } from '@lib/models'
import { GetServerSidePropsResult, NextPageContext } from 'next'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'

import {
  Heading,
  LinkBox,
  LinkOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react'

type Props = {
  events: (GroupEvent & { moment?: any })[]
}
export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await getServerSession(req as any, res, authOptions)
  if (!session || session.user.userType != 'staff') {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    }
  }
  const { listAdminEvents } = await import(
    'lib/services/directus/server/events'
  )
  const events = await listAdminEvents()
  return { props: { events } }
}

export default function AdminEventList({ events }: Props) {
  const { loading } = useUser({ minLevel: MemberLevel.staff })
  const eventList =
    events?.map((event) => {
      const date = new Date(new Date(event.datetime).toDateString())
      return {
        ...event,
        date
      }
    }) || []
  const today = new Date(new Date().toDateString())

  const upcoming = eventList?.filter((event) => event.date > today)
  const past = eventList?.filter((event) => event.date < today)
  past.sort((a, b) => {
    const dateA = new Date(a.datetime).getTime()
    const dateB = new Date(b.datetime).getTime()
    return dateB - dateA
  })

  const activeEvent = eventList?.find(
    (event) => Number(event.date) == Number(today)
  )

  return (
    <Page
      title="Event Admin"
      requireAuth={true}
      requiredLevel={MemberLevel.staff}
      loading={loading}
    >
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
                  <LinkOverlay as={Link} href={`/admin/event/${event.id}`}>
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
