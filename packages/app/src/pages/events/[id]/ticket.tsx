import { useEffect, useState } from 'react'
import { EventCard, EventTicket } from 'components/controls'
import Page from 'components/Page'
import { useEvent, useUser } from 'hooks'
import { EventUser, MemberLevel } from 'lib/models'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { ArrowBackIcon } from '@chakra-ui/icons'
import { HStack, Link } from '@chakra-ui/react'

export default function EventTicketPage() {
  const router = useRouter()
  const { id } = router.query
  const { member, loading, authenticated } = useUser({
    minLevel: MemberLevel.inductee,
    redirectsEnabled: false
  })
  const { event, loading: eventLoading, reload } = useEvent(id as string)
  const [invite, setInvite] = useState<EventUser>(undefined)

  useEffect(() => {
    if (member?.events && !invite) {
      const i = member.events.find((e) => String(e.events_id) == id)
      setInvite(i)
    }
  }, [id, invite, member?.events, member?.id])

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
          >
            {invite && invite.rsvp == 'confirmed' && (
              <EventTicket open event={event} member={member} />
            )}
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
