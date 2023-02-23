import { Alert, HStack, Flex, AlertIcon, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/controls'
import { MemberLevel, User, EventDetail } from 'lib/models'
import { GetServerSidePropsResult, NextPageContext } from 'next'
import Page from 'components/Page'
import { useState } from 'react'
import { useUser } from 'hooks'
type Props = {
  event: EventDetail
  user?: User
  error?: string
}

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { getEvent } = await import('lib/services/directus/server/events')
  const { getUser } = await import('lib/services/directus/server/users')
  const { id, user_id, error } = context.query

  let user = null
  const event = (await getEvent(id as string)) as EventDetail

  if (event && user_id) user = await getUser(user_id as string)

  if (!event) {
    return {
      notFound: true,
    }
  }
  if (error) return { props: { event, user, error: error as string } }
  return { props: { event, user } }
}

export default function EventAdmin({ event, error }: { event: EventDetail; error: string }) {
  const { member, level, loading } = useUser()
  const [fees] = useState(event.cost * event.paid_count)
  const isStaff = level >= MemberLevel.staff

  return (
    <Page title={event?.name + ' Admin'} loading={loading} requireAuth={true}>
      {member && (
        <EventCard event={event}>
          <Flex direction="column" gap={4}>
            {error && (
              <Alert status="error" size="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <HStack spacing={4}>
              {isStaff && (
                <Stat>
                  <StatLabel>Invited</StatLabel>
                  <StatNumber>{event.invited_count}</StatNumber>
                </Stat>
              )}
              <Stat>
                <StatLabel>Confirmed</StatLabel>
                <StatNumber>{event.confirmed_count}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Maybe</StatLabel>
                <StatNumber>{event.maybe_count}</StatNumber>
              </Stat>
              {isStaff && (
                <>
                  <Stat>
                    <StatLabel>Attended</StatLabel>
                    <StatNumber>{event.attended_count}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Paid</StatLabel>
                    <StatNumber>{event.paid_count}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Collected</StatLabel>
                    <StatNumber>${fees}</StatNumber>
                  </Stat>
                </>
              )}
            </HStack>
          </Flex>
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/event" my={4}>
          Back to Events
        </LinkButton>
        {isStaff && (
          <LinkButton colorScheme="primary" href="/member/scan" my={4}>
            Scan Invite
          </LinkButton>
        )}
      </HStack>
    </Page>
  )
}
