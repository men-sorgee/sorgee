import {
  Alert,
  HStack,
  Flex,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  AvatarGroup,
  SimpleGrid,
} from '@chakra-ui/react'
import { EventCard, LinkButton } from 'components/controls'
import { EventStats, EventUser, MemberLevel, User } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useEvent, useUser } from '../../../hooks'
import { useRouter } from 'next/router'

export default function EventAdmin() {
  const router = useRouter()
  const { member, authorized, loading } = useUser(MemberLevel.staff)

  const { id, error } = router.query
  const [eventId] = useState<string>(String(id))
  const { event, loading: eventLoading } = useEvent(eventId)
  const [fees, setFees] = useState<number>(undefined)

  const [stats, setStats] = useState<EventStats>(undefined)
  const today = new Date()
  useEffect(() => {
    if (!eventLoading && event?.stats && !stats) {
      setStats(event.stats)
      if (event.stats.attended_count) {
        setFees(event.stats.attended_count * event.cost)
      }
    }
  }, [event, eventLoading, stats])
  const getAttendees = (rsvp) => {
    return event?.attendance
      ?.filter((u) => u.rsvp == rsvp)
      .map(({ users_id: u }: EventUser) => u as User)
      .map((u) => {
        const picture = u.picture as string
        const name = u.nickname || u.first_name || 'Brother'
        const src = picture ? '/api/asset/' + picture : undefined
        return {
          id: u.id,
          name,
          src,
        }
      })
  }
  return (
    <Page
      title={event ? event.name + ' Admin' : 'Loading'}
      loading={loading}
      requireAuth={true}
      requiredLevel={MemberLevel.staff}
    >
      {member && event && (
        <EventCard event={event} showDescription={false}>
          <Flex direction="column" gap={4}>
            {error && (
              <Alert status="error" size="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Flex>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            {stats && (
              <>
                {stats.invited_count && (
                  <Stat>
                    <StatLabel>Invited</StatLabel>
                    <StatNumber>{stats.invited_count}</StatNumber>
                  </Stat>
                )}

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
                {fees != undefined && (
                  <Stat>
                    <StatLabel>Collected</StatLabel>
                    <StatNumber>${fees}</StatNumber>
                  </Stat>
                )}
              </>
            )}
          </SimpleGrid>
          {stats && (
            <Flex direction="column" gap={4}>
              <HStack>
                <Stat>
                  <StatLabel>Confirmed</StatLabel>
                  <StatNumber>{stats.confirmed_count}</StatNumber>
                </Stat>
                <AvatarGroup size="md" max={10}>
                  {getAttendees('confirmed').map(({ id, name, src }) => (
                    <Avatar
                      key={id}
                      name={name}
                      src={src}
                      title={name}
                      cursor="pointer"
                      onClick={() => {
                        router.push('/members/' + id)
                      }}
                    />
                  ))}
                </AvatarGroup>
              </HStack>

              <HStack>
                <Stat>
                  <StatLabel>Maybe</StatLabel>
                  <StatNumber>{stats.maybe_count}</StatNumber>
                </Stat>
                <AvatarGroup size="md" max={10}>
                  {getAttendees('maybe').map(({ id, name, src }) => (
                    <Avatar
                      key={id}
                      name={name}
                      src={src}
                      title={name}
                      cursor="pointer"
                      onClick={() => {
                        router.push('/members/' + id)
                      }}
                    />
                  ))}
                </AvatarGroup>
              </HStack>
            </Flex>
          )}
        </EventCard>
      )}
      <HStack spacing={4}>
        <LinkButton href="/admin/event" my={4}>
          Back to Events
        </LinkButton>

        <LinkButton colorScheme="primary" href="/member/scan" my={4}>
          Scan Invite
        </LinkButton>
      </HStack>
    </Page>
  )
}
