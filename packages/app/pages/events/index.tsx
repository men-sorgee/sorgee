import { NextPageContext, GetServerSidePropsResult } from 'next'
import { EventDetail, MemberLevel } from 'lib/models'
import Page from 'components/Page'
import {
  Card,
  CardHeader,
  Flex,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  Heading,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/react'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {
  events: (EventDetail & { moment?: any })[]
}
export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await getServerSession(req as any, res, authOptions)
  const level = MemberLevel[session.user.user_type]
  if (!session || !session.user || level < MemberLevel.inductee) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { listEvents } = await import('lib/services/directus/server/events')
  const events = await listEvents(level >= MemberLevel.staff)
  return { props: { events } }
}

const moment = async (date: string) => import('moment').then(({ default: moment }) => moment(date))

export default function EventList({ events: eventList }: Props) {
  const [events, setEvents] = useState([])
  async function getEventDate(eventStart: string) {
    let eventDate = await moment(eventStart)
    return {
      day: eventDate.format('dddd'),
      short: eventDate.format('MMM D'),
      month: eventDate.format('MMM'),
      date: eventDate.format('D'),
      time: eventDate.format('h:mm A'),
    }
  }
  useEffect(() => {
    Promise.all(
      eventList.map(async (eventData) => {
        eventData.moment = await getEventDate(eventData.datetime)
        return eventData
      })
    ).then((events) => setEvents(events))
  }, [eventList, events])

  return (
    <Page title="Events" requireAuth={true}>
      <List w="full">
        {events?.map((event) => (
          <ListItem key={event.id} w="full">
            <LinkBox>
              <Card mb={2} p={0} bg={event.status == 'occurred' ? 'gray.100' : 'white'}>
                <CardHeader p={0} w="full">
                  <SimpleGrid columns={4} spacing={1} h="full" w="full">
                    <GridItem as="h4" colSpan={3} p={2}>
                      <LinkOverlay as={Link} href={`/events/${event.id}`}>
                        {event.name}
                      </LinkOverlay>
                    </GridItem>
                    <Heading as="h5" bg={'primary.500'} color={'white'} textAlign="center" p={2}>
                      {event.moment.month}
                      <br />
                      {event.moment.date}
                      <br />
                    </Heading>
                  </SimpleGrid>
                </CardHeader>
              </Card>
            </LinkBox>
          </ListItem>
        ))}
      </List>
    </Page>
  )
}
