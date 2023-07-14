import { useEffect, useRef, useState } from 'react'

import { ButtonLink, EventCard } from 'components/controls'
import Page from 'components/Page'
import { useUser } from 'hooks'
import { EventDetail, EventStats, Member, MemberLevel } from 'lib/models'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { ArrowBackIcon, CheckIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Link,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Wrap
} from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
  const { getEventDetail } = await import('lib/services/directus/server/events')
  const eventId = String(context.query.id)
  if (!eventId) {
    return {
      notFound: true
    }
  }
  const event = await getEventDetail(eventId)
  if (!event) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      event
    }
  }
}

export default function EventAdmin({ event }: { event: EventDetail }) {
  const router = useRouter()
  const { member, authorized, loading } = useUser({
    minLevel: MemberLevel.staff
  })
  const [fees, setFees] = useState<number>(undefined)
  const [stats] = useState<EventStats>(event.stats)
  const { error } = router.query
  useEffect(() => {
    if (event.stats && !fees) {
      setFees(event.stats.paid_count * event.cost)
    }
  }, [authorized, event, fees, loading, member, router, stats])

  const getAttendees = (rsvp: string) => {
    return event.attendance
      ?.filter((u) => u.rsvp == rsvp)

      .map((u) => {
        const user = u.users_id as Member
        const picture = user.picture as string
        const name = `${user.first_name} ${user.last_name} (${user.nickname})`
        const src = picture ? '/api/asset/' + picture : undefined
        return {
          id: u.id,
          name,
          rsvp: u.rsvp,
          attended: u.attended,
          src
        }
      })
  }
  const emailRef = useRef<HTMLInputElement>(null)
  const emailCheckin = () => {
    const email = emailRef.current.value
    if (email) {
      location.href = `/api/events/checkin?event_id=${event.id}&email=${email}`
    }
  }

  return (
    <Page
      title={'Event Admin'}
      loading={loading}
      requireAuth={true}
      requiredLevel={MemberLevel.staff}
    >
      {error && (
        <Alert status="error" size="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {member && event && (
        <EventCard
          event={event}
          showDescription={false}
          footer={
            <>
              <ButtonLink
                colorScheme="primary"
                href="/admin/scan"
                color="white"
              >
                Scan Invite
              </ButtonLink>

              <Input
                rounded={'md'}
                p={1}
                w="30%"
                name="email"
                ref={emailRef}
                size="sm"
                placeholder="Email"
              />
              <Button size={'md'} ml={2} p={1} onClick={() => emailCheckin()}>
                Email Checkin
              </Button>
            </>
          }
        >
          <SimpleGrid columns={[2, 4, 6]} spacing={4} mb={4}>
            {stats && (
              <>
                {stats.invited_count && (
                  <Stat>
                    <StatLabel>Invited</StatLabel>
                    <StatNumber>{stats.invited_count}</StatNumber>
                  </Stat>
                )}
                <Stat>
                  <StatLabel>Confirmed</StatLabel>
                  <StatNumber>{stats.confirmed_count}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Maybe</StatLabel>
                  <StatNumber>{stats.maybe_count}</StatNumber>
                </Stat>

                {stats.attended_count != undefined && (
                  <Stat>
                    <StatLabel>Attended</StatLabel>
                    <StatNumber>{stats.attended_count}</StatNumber>
                  </Stat>
                )}
                {stats.paid_count != undefined && (
                  <Stat>
                    <StatLabel>Paid</StatLabel>
                    <StatNumber>{stats.paid_count}</StatNumber>
                  </Stat>
                )}
              </>
            )}
          </SimpleGrid>
          <Heading as="h3" size="h3">
            Confirmed
          </Heading>
          <Wrap>
            {getAttendees('confirmed').map(({ id, name, src, attended }) => (
              <Box key={id} position="relative">
                <Avatar
                  opacity={attended ? 1 : 0.5}
                  name={name}
                  src={src}
                  title={name}
                />
                {attended && (
                  <CheckIcon
                    color="green"
                    boxSize={8}
                    position="absolute"
                    ml={-6}
                  />
                )}
              </Box>
            ))}
          </Wrap>
          <Heading as="h3" size="h3">
            Maybe
          </Heading>
          <Wrap>
            {getAttendees('maybe').map(({ id, name, src, attended }) => (
              <Box key={id} position="relative">
                <Avatar
                  key={id}
                  opacity={attended ? 1 : 0.5}
                  name={name}
                  src={src}
                  title={name}
                />
                {attended && <CheckIcon boxSize={6} />}
              </Box>
            ))}
          </Wrap>
        </EventCard>
      )}
      <HStack spacing={4} my={4}>
        <Link as={NextLink} href="/admin/event">
          <ArrowBackIcon mr={2} w="50" />
          Back to Events
        </Link>
        <Link as={NextLink} href={`/events/${event?.id}`}>
          Event Details
        </Link>
      </HStack>
    </Page>
  )
}
