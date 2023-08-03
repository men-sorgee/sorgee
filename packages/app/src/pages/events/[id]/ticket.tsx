import { Page } from "components";
import { EventCard, EventTicket } from "components/controls";
import { useInvite, useUser } from "hooks";
import { MemberLevel } from "lib/models";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { HStack, Link } from "@chakra-ui/react";

export default function EventTicketPage() {
  const router = useRouter()
  const { id } = router.query
  const eventId = String(id)

  const { member, loading, authenticated } = useUser({
    minLevel: MemberLevel.inductee,
    redirectsEnabled: true
  })
  const { invite, event, loading: eventLoading } = useInvite(eventId)

  return (
    <Page
      title="Event Ticket"
      hideHeader
      loading={loading || eventLoading}
      pt={4}
    >
      {authenticated && member && event && (
        <>
          <EventCard
            event={invite?.event}
            showDescription={false}
            isGuest={invite?.guest}
            isPaid={invite?.paid}
            hideBody
            hideFooter
          >
            {invite && <EventTicket responsive event={event} member={member} />}
          </EventCard>
        </>
      )}
    </Page>
  )
}
