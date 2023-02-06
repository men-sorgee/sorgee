import { NextPageContext, GetServerSidePropsResult } from 'next'
import { EventDetail, MemberLevel } from 'lib/models'
import Page from 'components/Page'
import { List, ListItem } from '@chakra-ui/react'
import { unstable_getServerSession } from 'next-auth/next'

type Props = {
  events: EventDetail[]
}
export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await unstable_getServerSession(req as any, res, authOptions)
  if (!session || !session.user || MemberLevel[session.user.user_type] >= MemberLevel.staff) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { listEvents } = await import('lib/services/directus/server/events')
  const events = await listEvents()
  return { props: { events } }
}

export default function EventList({ events }: Props) {
  return (
    <Page title="Events" requireAuth={true}>
      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <a href={`/events/${event.id}`}>
              {event.name}-{event.status}
            </a>
          </ListItem>
        ))}
      </List>
    </Page>
  )
}
