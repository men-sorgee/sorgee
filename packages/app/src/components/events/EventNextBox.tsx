import { ButtonLink, EventCard, EventRSVP } from "components";
import { useInvites } from "hooks";
import { EventInvite, Member } from "lib/models";
import { ReactNode, useEffect, useState } from "react";

import { Box, BoxProps, chakra } from "@chakra-ui/react";

export type EventNextProps = BoxProps & {
  member: Member
  children?: ReactNode
}

export const EventNextBox = chakra(({ member, children, ...props }: EventNextProps) => {
  const { invitations, upcoming, activeInvite, loading: eventsLoading } = useInvites()

  const [invite, setInvite] = useState<EventInvite>(undefined)
  useEffect(() => {
    if (!eventsLoading && invite == undefined) {
      if (activeInvite) {
        setInvite(activeInvite)
      }
      if (upcoming.length > 0) {
        setInvite(upcoming[0])
      } else if (invitations.length > 0) {
        setInvite(invitations[0])
      } else {
        setInvite(null)
      }
    }
  }, [invite, eventsLoading, invitations, upcoming, activeInvite])

  return (
    <Box {...props} w="full">
      {children}
      {invite && (

        <EventCard event={invite?.event}>


          <ButtonLink
            href={`/events/${invite.event.id}`}
            colorScheme="primary"
            mx="auto"
            mt={4}
            size="lg"
            fontSize={['md', 'lg', 'xl']}
          >
            View Event
          </ButtonLink>

          <EventRSVP eventId={invite.event.id} invite={invite} canConfirm={member.rating > 3} />
        </EventCard>
      )}
      <ButtonLink
        href="/events"
        colorScheme="accent"
        mx="auto"
        mt={4}
        size="lg"
        fontSize={['md', 'lg', 'xl']}
      >
        View All Events
      </ButtonLink>
    </Box>
  )
})
