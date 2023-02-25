import { Alert, HStack, Flex, AlertIcon, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/controls'
import { MemberLevel, User, EventDetail, GroupEvent } from 'lib/models'
import { GetServerSidePropsResult, NextPageContext } from 'next'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser } from '../../../hooks'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'

type Props = {
  event: EventDetail
  user: User
  error?: string
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
        destination: '/calendar',
        permanent: false,
      },
    }
  }
  const { getEventDetail } = await import('lib/services/directus/server/events')
  const { getUser } = await import('lib/services/directus/server/users')
  const { id, user_id, error } = context.query

  let user = null
  const event = (await getEventDetail(id as string)) as EventDetail

  if (event && user_id) user = await getUser(user_id as string)

  if (!event) {
    return {
      notFound: true,
    }
  }
  if (error) return { props: { event, user, error: error as string } }
  return { props: { event, user } }
}

export default function EventAdmin({ event, error }: Props) {
  const router = useRouter()
  const { member, authorized, loading } = useUser(MemberLevel.staff)

  useEffect(() => {
    if (!loading && !authorized) {
      router.push('/calendar')
    }
  }, [authorized, loading, router])
  return (
    <Page title={event.name + ' Admin'} loading={loading} requireAuth={true}>
      {member && (
        <EventCard event={event}>
          <Flex direction="column" gap={4}>
            {error && (
              <Alert status="error" size="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Flex>
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/event" my={4}>
          Back to Events
        </LinkButton>

        <LinkButton colorScheme="primary" href="/member/scan" my={4}>
          Scan Invite
        </LinkButton>
      </HStack>
    </Page>
  )
}
