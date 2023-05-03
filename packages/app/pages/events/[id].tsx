import {
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  Flex,
  Divider,
  StatGroup,
  useBreakpointValue,
  Box,
  Link,
  Text,
  Heading,
  Spacer,
  useColorModeValue,
  Alert,
  AlertIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Wrap,
} from '@chakra-ui/react'
import {
  EventCard,
  EventTicket,
  ButtonLink,
  MemberSpotlight,
  RateItem,
  EventRSVP,
  ModalPopup,
} from 'components/controls'
import { EventDetail, EventStats, EventUser, FieldMap, Member, MemberLevel, User } from 'lib/models'
import Page from 'components/Page'
import { useEffect, useState } from 'react'
import { useUser, useEvent } from 'hooks'
import { useRouter } from 'next/router'
import { isAfter, isToday } from 'date-fns'
import { ArrowBackIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { brand } from 'lib/config/brand'
import { NextPageContext } from 'next'

export type PageProps = {
  fields: FieldMap
  id?: string
}

export const getServerSideProps = async (context: NextPageContext) => {
  const { getFields } = await import('lib/services/directus/server')
  const fields = await getFields('users')
  return {
    props: {
      fields,
      id: context.query.id,
    },
  }
}

export default function EventPage({ id, fields }) {
  const router = useRouter()
  const { id: i } = router.query
  const {
    member,
    loading,
    isStaff,
    reload: reloadUser,
    authenticated,
  } = useUser({ minLevel: MemberLevel.inductee })

  const [eventId] = useState<string>(i || id)
  const [showTicket, setShowTicket] = useState<boolean>(false)
  const { event, loading: eventLoading } = useEvent(eventId)
  const [stats, setStats] = useState<EventStats>(undefined)
  const [invite, setInvite] = useState<EventUser>(undefined)
  const [memberId, setMemberId] = useState<string>(undefined)

  useEffect(() => {
    if (!eventLoading && event?.stats && !stats) {
      setStats(event.stats)
      setShowTicket(
        isToday(new Date(event.datetime)) && !isAfter(new Date(), new Date(event.datetime_end))
      )
    }
    if (member?.events && !invite) {
      const i = member.events.find((e) => e.events_id == eventId)
      setInvite(i)
    }
  }, [event, eventId, eventLoading, invite, member?.events, member?.id, stats])

  const getAttendees = (rsvp: string) => {
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

  if (!authenticated) return null

  return (
    <Page title="Event Details" loading={loading || eventLoading} requireAuth={true}>
      {member && event && (
        <EventCard
          event={event}
          showDescription
          showLocation={invite != null}
          showAddToCalendar={invite != null}
          isGuest={invite?.guest}
        >
          {showTicket && invite && invite.rsvp == 'confirmed' && (
            <EventTicket open event={event} member={member} />
          )}
          <Divider my={4} />
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            {stats && isStaff && (
              <StatGroup>
                {event?.invite_only && stats.invited_count && (
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
              </StatGroup>
            )}
          </SimpleGrid>
          {stats && event.status != 'occurred' && invite && (
            <Flex direction="column" gap={4}>
              <HStack align="start" justify="end">
                <Stat>
                  <StatLabel>Confirmed</StatLabel>
                  <StatNumber>{stats.confirmed_count}</StatNumber>
                </Stat>
                <Wrap spacing={-2}>
                  {getAttendees('confirmed').map(({ id, name, src }) => (
                    <Avatar
                      key={id}
                      name={name}
                      src={src}
                      title={name}
                      cursor="pointer"
                      onClick={() => {
                        if (invite?.rsvp == 'confirmed') setMemberId(id)
                      }}
                    />
                  ))}
                </Wrap>
              </HStack>

              <HStack align="start" justify="right">
                <Stat>
                  <StatLabel>Maybe</StatLabel>
                  <StatNumber>{stats.maybe_count}</StatNumber>
                </Stat>
                <Wrap spacing={-2}>
                  {getAttendees('maybe').map(({ id, name, src }) => (
                    <Avatar
                      key={id}
                      name={name}
                      src={src}
                      title={name}
                      cursor="pointer"
                      onClick={() => {
                        if (invite?.rsvp == 'confirmed') setMemberId(id)
                      }}
                    />
                  ))}
                </Wrap>
              </HStack>
            </Flex>
          )}
          {event.status == 'occurred' && invite?.attended && (
            <AttendedEvent event={event} member={member} invite={invite} reloadUser={reloadUser} />
          )}
          {event.status != 'occurred' && (invite || !event.invite_only) && (
            <EventRSVP memberId={member.id} eventId={id} rsvp={invite?.rsvp} />
          )}
        </EventCard>
      )}
      <HStack spacing={4} mt={4}>
        <Link as={NextLink} href="/events">
          <ArrowBackIcon mr={2} w="50" />
          Back to Events
        </Link>
        {isStaff && (
          <Link as={NextLink} href={`/admin/event/${eventId}`} my={4}>
            Event Admin
          </Link>
        )}
      </HStack>
      <ModalPopup
        size={brand.breakPoints}
        isOpen={memberId != undefined}
        onClose={() => setMemberId(undefined)}
      >
        <MemberSpotlight id={memberId} fields={fields} full />
      </ModalPopup>
    </Page>
  )
}

const AttendedEvent = ({
  event,
  member,
  invite,
  reloadUser,
}: {
  event: EventDetail
  member: Member
  invite: EventUser
  reloadUser: () => void
}) => {
  const attendees = event.attendance
    .filter((u) => u.attended)
    .map((u) => u.users_id as User)
    .filter((u) => u.id != member.id)

  const color = useColorModeValue('gray.700', 'gray.200')

  return (
    <>
      <Divider mt={4} />
      <Heading as="h5" size="md">
        Rate Event:
      </Heading>
      <Flex
        mt={4}
        direction={['column', 'column', 'row']}
        gap={2}
        align="center"
        justify="space-between"
      >
        <RateItem item_id={event.id} collection="events" aria-label={'Rate Event'} />
        <Spacer />
        {invite.attended &&
          event.surveys?.map((s) => (
            <ButtonLink key={s.id} size="md" href={`/survey/${s.id}/1`} colorScheme="accent">
              {s.title}
            </ButtonLink>
          ))}
      </Flex>

      {attendees.length > 0 && (
        <>
          <Divider mt={4} />
          <Heading as="h5" size="md">
            Rate Attendees:
          </Heading>
          <Text ml={0} mb={2}>
            Rate the vibe and behavior of your fellow attendees to this event.
          </Text>
          <Alert mb={4} rounded="lg" status="error">
            <AlertIcon />
            <strong>
              This is not a personal attraction rating, but a rating of their behavior and attitude
              at the event!
            </strong>
          </Alert>
          {attendees.map((u: User) => (
            <Box key={event.id + '-' + u.id} bg="gray.400" mb={4} rounded="lg">
              <MemberSpotlight size="md" id={u.id} color="white" full>
                <RateItem
                  onChange={() => {
                    reloadUser()
                  }}
                  item_id={u.id}
                  collection="users"
                  aria-label={'Rate this member'}
                >
                  Your Rating:
                </RateItem>
              </MemberSpotlight>
            </Box>
          ))}
        </>
      )}
    </>
  )
}
