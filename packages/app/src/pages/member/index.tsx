import { capitalCase } from "change-case";
import {
  EventNextBox,
  MemberProgress,
  MembersNewBox,
  MemberStatsBox,
  Page
} from "components";
import { useUser } from "hooks";
import { MemberLevel } from "lib/models";

import { Alert, AlertIcon, Box, Heading, Text } from "@chakra-ui/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

import { LocationBox } from "../../components/controls/LocationBox";

export default function MemberHomePage() {
  const { member, level, loading } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true,
  })
  const levelName = level ? capitalCase(MemberLevel[level]) : 'Member'

  return (
    <Page title={`Welcome ${levelName}!`} description="" loading={loading}>
      {level == MemberLevel.pledge && (
        <>
          <Box maxWidth="xl" mx="auto">
            <Text fontSize="xl">
              You joined the site without an existing Brother to vouch for you. That is 100% okay!
              We encourage Brothers to browse Pledge profiles and reach out to those they want to
              contact and potentially vouch for.
            </Text>
          </Box>
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
        </>
      )}
      {level == MemberLevel.inductee && (
        <>
          <Box maxWidth="xl" mx="auto">
            <Text fontSize="xl">
              As an Inductee, your primary mission is to attend an event and get approval from the
              group. Once you have been approved, you will graduate to Brother and be able to see
              the full list of Brothers and their contact information.
            </Text>
          </Box>
          <EventNextBox member={member} borderBottom="6px dotted black" pb={8} />
        </>
      )}
      <LocationBox member={member} borderBottom="6px dotted black" pb={4}>
        <Heading as="h2" size="xl" textAlign="center">
          Share Your Location
        </Heading>
      </LocationBox>
      {level >= MemberLevel.brother && (
        <>
          <MemberStatsBox borderTop="6px dotted black" pb={8} textAlign="center">
            <Heading as="h2" size="xl" textAlign="center">
              Latest Stats
            </Heading>
          </MemberStatsBox>

          <EventNextBox member={member} borderTop="6px dotted black" pb={8} textAlign="center">
            <Heading as="h2" size="xl" textAlign="center">
              Next Event:
            </Heading>
          </EventNextBox>

          <MembersNewBox member={member} borderTop="6px dotted black" pb={8} textAlign="center">
            <Heading as="h2" size="xl" textAlign="center">
              Fresh Meet!
            </Heading>
            <Text fontSize="xl" mb={2} textAlign="center">
              As a Brother, you can chat with any Pledge that has not been adopted. If you think
              they are trustworthy, you can vouch for them and they will become an Inductee.
            </Text>
          </MembersNewBox>
        </>
      )}
    </Page>
  )
}
