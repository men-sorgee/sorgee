import { Alert, HStack, Flex, AlertIcon } from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/ui'
import { MemberLevel, Event, User } from 'lib/models'
import { GetServerSidePropsResult, NextPageContext } from 'next'
import { useMember } from 'hooks/use-member'
import Page from 'components/Page'
type Props = {
  event: Event
  user?: User
  error?: string
}

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { getEvent, getUser } = await import('lib/services/directus/server/users')
  const { event_id, user_id, error } = context.query

  let user = null
  const event = (await getEvent(event_id as string)) as Event

  if (event && user_id) user = await getUser(user_id as string)

  if (!event) {
    return {
      notFound: true,
    }
  }
  if (error) return { props: { event, user, error: error as string } }
  return { props: { event, user } }
}

export default function EventAdmin({ event, error }: { event: Event; error: string }) {
  const { member, loading } = useMember()
  return (
    <Page title="Event" loading={loading}>
      {member && (
        <EventCard event={event} level={MemberLevel[member.user_type]}>
          <Flex direction="column" gap={4}>
            {error && (
              <Alert status="error" size="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <HStack spacing={4}>
              <LinkButton colorScheme="primary" href="/member/scan" my={4}>
                Scan Another
              </LinkButton>
              <LinkButton colorScheme="gray" href={'/event/' + event.id} my={4}>
                Return to Event
              </LinkButton>
            </HStack>
          </Flex>
        </EventCard>
      )}
    </Page>
  )
}
