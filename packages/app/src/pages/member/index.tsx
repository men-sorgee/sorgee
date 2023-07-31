import {
  MemberProgress,
  MemberCard,
  Page,
  ButtonLink,
  EventCard
} from 'components'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import {
  Text,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Box,
  Alert,
  AlertIcon,
  SimpleGrid,
  Flex,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  GridItem
} from '@chakra-ui/react'
import { useEvents, useMemberSearch, useUser } from 'hooks'
import { MemberLevel, MemberStats } from 'lib/models'
import { capitalCase } from 'change-case'
import { addDays } from 'date-fns'
import { useState, useEffect } from 'react'
import { getJSON } from 'lib/utils'
import NextLink from 'next/link'

export default function MemberHomePage() {
  const { member, level, loading } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true
  })
  const levelName = level ? capitalCase(MemberLevel[level]) : 'Member'

  const { members: pledges, meta: pledgeMeta } = useMemberSearch(
    1,
    4,
    'date_created',
    {
      user_type: MemberLevel[MemberLevel.pledge]
    }
  )
  const [stats, setStats] = useState<MemberStats>()
  const [statsR, setStatsR] = useState<MemberStats>()

  useEffect(() => {
    if (stats && statsR) return
    getJSON(`/api/stats`).then(({ data }) => {
      setStats(data)
    })
    getJSON(`/api/stats?start=${addDays(new Date(), -14).toISOString()}`).then(
      ({ data }) => {
        setStatsR(data)
      }
    )
  }, [stats, statsR])

  const { events } = useEvents()

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
          {stats && statsR && (
            <Box>
              <Heading as="h2" size="xl" textAlign="center" mt={10}>
                Latest Stats
              </Heading>

              <StatGroup
                alignContent="center"
                justifyContent="space-between"
                justifyItems="stretch"
                as={Flex}
                w="full"
                flexWrap={'wrap'}
                gap={4}
                shadow={0}
                p={[1, 2, 4]}
              >
                <Stat textAlign="center">
                  <StatLabel>Applicants</StatLabel>
                  <StatNumber>{stats.applicants}</StatNumber>
                  {statsR.applicants > 0 && (
                    <StatHelpText title="In the past 14 days">
                      <StatArrow type="increase" />+ {statsR.applicants}
                    </StatHelpText>
                  )}
                </Stat>
                <Stat textAlign="center">
                  <StatLabel>Pledges</StatLabel>
                  <StatNumber>{stats.pledges}</StatNumber>
                  {statsR.pledges > 0 && (
                    <StatHelpText title="In the past 14 days">
                      <StatArrow type="increase" />+ {statsR.pledges}
                    </StatHelpText>
                  )}
                </Stat>
                <Stat textAlign="center">
                  <StatLabel>Inductees</StatLabel>
                  <StatNumber>{stats.inductees}</StatNumber>

                  {statsR.inductees > 0 && (
                    <StatHelpText title="In the past 14 days">
                      <StatArrow type="increase" />+ {statsR.inductees}
                    </StatHelpText>
                  )}
                </Stat>
                <Stat textAlign="center">
                  <StatLabel>Brothers</StatLabel>
                  <StatNumber>{stats.brothers}</StatNumber>
                  {statsR.brothers > 0 && (
                    <StatHelpText title="In the past 14 days">
                      <StatArrow type="increase" />+ {statsR.brothers}
                    </StatHelpText>
                  )}
                </Stat>

                <Stat textAlign="center">
                  <StatLabel whiteSpace="nowrap">Big-Brothers</StatLabel>
                  <StatNumber>{stats.big_brothers}</StatNumber>
                  {statsR.big_brothers > 0 && (
                    <StatHelpText title="In the past 14 days">
                      <StatArrow type="increase" />+ {statsR.big_brothers}
                    </StatHelpText>
                  )}
                </Stat>
              </StatGroup>
            </Box>
          )}
          {events && events.length > 0 && (
            <Box borderTop="6px dotted black" mb={4}>
              <Heading as="h2" size="xl" mb={2} textAlign="center">
                Upcoming Event:
              </Heading>
              <LinkBox>
                <EventCard event={events[0]}>
                  <LinkOverlay as={NextLink} href={`/events/${events[0].id}`} />
                </EventCard>
              </LinkBox>
            </Box>
          )}
          {pledges && (
            <Box pb={4} borderTop="6px dotted black">
              <Heading as="h2" size="xl" textAlign="center">
                Fresh Meet!
              </Heading>
              <Text fontSize="xl">
                As a Brother, you can chat with any Pledge that has not been
                adopted. If you think they are trustworthy, you can vouch for
                them and they will become an Inductee.
              </Text>
              <Heading as="h3" size="lg" textAlign="center" mt={10}>
                {pledges.length} of {pledgeMeta.filtered} New Pledges
              </Heading>
              <SimpleGrid columns={[1, 1, 2]} spacing={4}>
                {pledges?.map((p) => (
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
                  >
                    View All Pledges
                  </ButtonLink>
                </GridItem>
              </SimpleGrid>
            </Box>
          )}
        </>
      )}
      <Box borderTop="6px dotted black">
        <Heading as="h2" size="xl" textAlign="center" mt={10}>
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
