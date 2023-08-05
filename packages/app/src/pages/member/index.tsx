import { capitalCase } from "change-case";
import {
  ButtonLink,
  EventCard,
  EventRSVP,
  LocationCapture,
  MemberCard,
  MemberProgress,
  MemberStats,
  Page
} from "components";
import { useInvites, useMemberSearch, useUser } from "hooks";
import { EventInvite, MemberLevel, SearchableMember } from "lib/models";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import {
  Alert,
  AlertIcon,
  Box,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Skeleton,
  Text
} from "@chakra-ui/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function MemberHomePage() {
  const [newestPledges, setNewestPledges] = useState<SearchableMember[]>([])
  const [oldestPledges, setOldestPledges] = useState<SearchableMember[]>([])
  const { member, level, loading } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true
  })
  const levelName = level ? capitalCase(MemberLevel[level]) : 'Member'
  const { show_location, location } = member || {
    show_location: false
  }
  const { members: pledges, meta: pledgeMeta } = useMemberSearch(
    1,
    50,
    '-approved_date',
    {
      user_type: MemberLevel[MemberLevel.pledge]
    }
  )
  useEffect(() => {
    if (
      pledges &&
      pledges.length > 0 &&
      newestPledges.length == 0 &&
      oldestPledges.length == 0
    ) {
      setNewestPledges(pledges.slice(0, 4))
      setOldestPledges(pledges.slice(-4))
    }
  }, [newestPledges.length, oldestPledges.length, pledges])

  const {
    invitations,
    upcoming,
    activeInvite,
    loading: eventsLoading
  } = useInvites()

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
    <Page title="Member Home" description="" hideHeader loading={loading}>
      <Heading as="h1" size="2xl" textAlign="center">
        Welcome {levelName}!
      </Heading>

      {level == MemberLevel.pledge && (
        <>
          <Box maxWidth="xl" mx="auto">
            <Text fontSize="xl">
              You joined the site without an existing Brother to vouch for you.
              That is 100% okay! We encourage Brothers to browse Pledge profiles
              and reach out to those they want to contact and potentially vouch
              for.
            </Text>
          </Box>
        </>
      )}
      {level == MemberLevel.inductee && (
        <>
          <Box maxWidth="xl" mx="auto">
            <Text fontSize="xl">
              As an Inductee, your primary mission is to attend an event and get
              approval from the group. Once you have been approved, you will
              graduate to Brother and be able to see the full list of Brothers
              and their contact information.
            </Text>
          </Box>
        </>
      )}
      {level >= MemberLevel.brother && (
        <>
          {show_location && location == undefined && (
            <Box borderBottom="6px dotted black" pb={4}>
              <Heading as="h2" size="xl" textAlign="center">
                Share Your Location
              </Heading>
              <LocationCapture />
            </Box>
          )}

          <Box borderBottom="6px dotted black" pb={4}>
            <MemberStats />
          </Box>

          <Skeleton isLoaded={eventsLoading}>
            <Box borderBottom="6px dotted black" pb={8}>
              <Heading as="h2" size="xl" mb={2} textAlign="center">
                {activeInvite ? `TODAY's` : `Next`} Event:
              </Heading>
              <LinkBox>
                {event && (
                  <EventCard event={invite.event}>
                    <EventRSVP
                      eventId={invite.event.id}
                      invite={invite}
                      canConfirm={member.rating > 3}
                    />
                    <LinkOverlay
                      as={NextLink}
                      href={`/events/${invite.event.id}`}
                    />
                  </EventCard>
                )}
              </LinkBox>
            </Box>
          </Skeleton>
          {pledges && (
            <>
              <Box borderBottom="6px dotted black" pb={8}>
                <Heading as="h2" size="xl" textAlign="center">
                  Fresh Meet!
                </Heading>
                <Text fontSize="xl" mb={2} textAlign="center">
                  As a Brother, you can chat with any Pledge that has not been
                  adopted. If you think they are trustworthy, you can vouch for
                  them and they will become an Inductee.
                </Text>

                <SimpleGrid columns={[1, 1, 2]} spacing={4}>
                  {newestPledges?.map((p) => (
                    <MemberCard
                      key={p.id}
                      member={p}
                      viewer={member}
                      full={false}
                    />
                  ))}
                </SimpleGrid>

                <Text textAlign="center" my={2}>
                  The oldest {oldestPledges.length} of {pledgeMeta.filtered}{' '}
                  Pledges still waiting...
                </Text>

                <SimpleGrid columns={[1, 1, 2]} spacing={4}>
                  {oldestPledges?.map((p) => (
                    <MemberCard
                      key={p.id}
                      member={p}
                      viewer={member}
                      full={false}
                    />
                  ))}
                  <GridItem colSpan={[1, 1, 2]} textAlign="center">
                    <ButtonLink
                      href="/members/pledges"
                      bg="accent.500"
                      color="white"
                      fontSize={['md', 'lg', 'xl']}
                    >
                      View All Pledges
                    </ButtonLink>
                  </GridItem>
                </SimpleGrid>
              </Box>
            </>
          )}
        </>
      )}
      <Box pb={4}>
        <Heading as="h2" size="xl" textAlign="center">
          Complete your profile!
        </Heading>
        <Alert
          my={4}
          p={8}
          rounded="lg"
          shadow="lg"
          alignItems="start"
          bg="primary.500"
          maxWidth="xl"
          mx="auto"
        >
          <AlertIcon boxSize={[30, 35, 40]} as={ClipboardDocumentListIcon} />
          <MemberProgress member={member} />
        </Alert>
      </Box>
    </Page>
  )
}
