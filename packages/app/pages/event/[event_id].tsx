import { Alert, HStack } from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/ui'
import { MemberLevel, Event } from 'lib/models'
import { GetServerSidePropsResult, NextPageContext } from 'next'
import { useMember } from 'hooks/use-member'
import Page from 'components/Page'
type Props = {
  event: Event
  error?: string
}

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { getEvent } = await import('lib/services/directus/server/users/events')
  const { event_id, error } = context.query

  const event = (await getEvent(event_id as string)) as Event

  if (!event) {
    return {
      notFound: true,
    }
  }
  if (error) return { props: { event, error: error as string } }
  return { props: { event } }
}

export default function EventAdmin({ event, error }: { event: Event; error: string }) {
  const { member, loading } = useMember()
  return (
    <Page title="Event" loading={loading}>
      {member && (
        <EventCard event={event} level={MemberLevel[member.user_type]}>
          <>
            {error && <Alert status="error">{error}</Alert>}
            <HStack spacing={4}>
              <LinkButton colorScheme="primary" href="/member/scan" my={4}>
                Scan Another
              </LinkButton>
              <LinkButton colorScheme="gray" href={'/event/' + event.id} my={4}>
                Return to Event
              </LinkButton>
            </HStack>
          </>
        </EventCard>
      )}
    </Page>
  )
}
