import {
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from '@chakra-ui/react'
import { EventCard, LinkButton, MemberSpotlight } from 'components/controls'
import { EventStats, EventUser, User } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser, useEvent } from 'hooks'
import { useRouter } from 'next/router'

export default function EventPage() {
  const router = useRouter()
  const { id } = router.query
  const [eventId] = useState<string>(String(id))
  const { event, loading: eventLoading } = useEvent(eventId)
  const { member, loading } = useUser()
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
    <Page title={event ? event.name : 'Event'} loading={loading || eventLoading} requireAuth={true}>
      {member && (
        <EventCard event={event} showDescription>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            {stats && (
              <>
                {stats.invited_count && (
                  <Stat>
                    <StatLabel>Invited</StatLabel>
                    <StatNumber>{stats.invited_count}</StatNumber>
                  </Stat>
                )}

                {stats.attended_count > 0 && (
                  <Stat>
                    <StatLabel>Attended</StatLabel>
                    <StatNumber>{stats.attended_count}</StatNumber>
                  </Stat>
                )}
                {stats.paid_count > 0 && (
                  <Stat>
                    <StatLabel>Paid</StatLabel>
                    <StatNumber>{stats.paid_count}</StatNumber>
                  </Stat>
                )}
                {stats.paid_count > 0 && fees > 0 && (
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
        <LinkButton href="/member/invites" my={4}>
          Back to Invites
        </LinkButton>
      </HStack>
    </Page>
  )
}
