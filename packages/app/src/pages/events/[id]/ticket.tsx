import { useEffect, useState } from 'react'
import { EventCard, EventTicket } from 'components/controls'
import { useEvent, useUser } from 'hooks'
import { EventUser, MemberLevel } from 'lib/models'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { HStack, Link } from '@chakra-ui/react'
import useSWR from 'swr'
import { JsonFetcher } from 'lib/utils'
import { Page } from 'components'

export default function EventTicketPage() {
  const router = useRouter()
  const { id } = router.query
  const { member, loading, authenticated } = useUser({
    minLevel: MemberLevel.inductee,
    redirectsEnabled: false
  })
  const key = `/api/events/rsvp?event_id=${String(id)}`
  const { event, loading: eventLoading, reload } = useEvent(id as string)
  const [invite, setInvite] = useState<Partial<EventUser>>(undefined)
  const { data: eventUser, isLoading: inviteLoading } = useSWR<
    Partial<EventUser>
  >(key, JsonFetcher, {
    isPaused: () => eventLoading
  })

  useEffect(() => {
    if (eventLoading == false && invite == undefined && eventUser) {
      setInvite(eventUser)
    }
  }, [eventLoading, eventUser, invite])

  return (
    <Page
      title="Event Details"
      loading={loading || eventLoading}
      requireAuth={true}
    >
      {authenticated && member && event && (
        <>
          <EventCard
            event={event}
            showDescription={false}
            isGuest={invite?.guest}
            isPaid={invite?.paid}
          >
            {invite && <EventTicket open event={event} member={member} />}
          </EventCard>

          <HStack spacing={4} mt={4}>
            <Link as={NextLink} href={`/events/${id}`}>
              <ArrowBackIcon mr={2} w="50" />
              Back to Event
            </Link>
          </HStack>
        </>
      )}
    </Page>
  )
}
