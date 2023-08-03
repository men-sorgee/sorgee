import { Plans } from "components";
import { ButtonLink } from "components/controls";
import Page from "components/Page";
import { useUser } from "hooks/use-user";
import { pledgeSurvey } from "lib/config";
import { ApplicationStatus, MemberLevel } from "lib/models";

import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

import ApplicationSteps from "./_steps";

function Approved() {
  const { loading, level, member } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.approved,
    redirectsEnabled: true
  })

  return (
    <Page
      title="Application Approved"
      loading={loading}
      header={<ApplicationSteps status={'approved'} />}
    >
      <>
        <Heading as="h2" size="h2" pt={10} textAlign="center">
          Congratulations and Welcome!
        </Heading>
        <Heading as="h3" size="h3" textAlign="center">
          Your application was approved.
        </Heading>

        <VStack alignItems="center" justifyItems="middle" pt={10}>
          {level == MemberLevel.inductee && (
            <Text textAlign="center">
              You will now get periodic event invites as well as access to our
              member-only content.
            </Text>
          )}
          {level == MemberLevel.pledge && (
            <>
              <Text textAlign="center">
                You need a brother to sponsor you before you can be inducted.
                Complete the pledge survey to get started. It will help brothers
                get to know who you are before reaching out. You will also want
                to complete your profile and make sure it is visible to
                brothers.
              </Text>
              <HStack spacing={4} textAlign="center" mt={4}>
                <ButtonLink
                  href={`/survey/${pledgeSurvey}`}
                  colorScheme="accent"
                  gradient
                >
                  Take the Pledge Questionnaire
                </ButtonLink>
              </HStack>
            </>
          )}
          {level == MemberLevel.brother &&
            member?.membership_type == 'none' && (
              <>
                <Plans allowSubscribe={true} />
                <Text>
                  Or stick with the free plan and complete your profile.
                </Text>
              </>
            )}

          <HStack spacing={4} textAlign="center" my={4}>
            {level >= MemberLevel.brother && (
              <ButtonLink href="/member/account" colorScheme="primary">
                Manage Account
              </ButtonLink>
            )}
            <ButtonLink href="/member/settings" colorScheme="primary">
              Manage Settings
            </ButtonLink>
            <ButtonLink href="/member/profile" colorScheme="primary">
              Manage Profile
            </ButtonLink>
          </HStack>
        </VStack>
      </>
    </Page>
  )
}

export default Approved
