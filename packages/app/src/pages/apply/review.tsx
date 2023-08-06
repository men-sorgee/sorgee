import { FieldRadioButtons, Form } from "components/forms";
import Page from "components/Page";
import { useUser } from "hooks/use-user";
import {
  ApplicationStatus,
  ContactPreferenceType,
  MemberLevel
} from "lib/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Alert, AlertIcon, Heading, Text, VStack } from "@chakra-ui/react";

import { BusyButton } from "../../components";
import ApplicationSteps from "./_steps";

function Review() {
  const router = useRouter()
  const [complete, setComplete] = useState<boolean>(false)

  const { loading, member, mutate } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.review,
    redirectsEnabled: true
  })

  useEffect(() => {
    if (!loading && member) {
      if (member.contact_preference) {
        setComplete(true)
      }
      const status = ApplicationStatus[member.application_status]
      if (status != ApplicationStatus.review) {
        router.push('/apply/' + member.application_status)
      }
    }
  }, [loading, member, router])

  return (
    <Page
      title="Application Review"
      loading={loading}
      header={<ApplicationSteps status={'review'} />}
    >
      <>
        <Heading as="h2" size="xl" pt={16}>
          Now, you wait...
        </Heading>

        {!complete && (
          <>
            <Text fontSize="2xl" pt={16} mx="auto" w="full">
              How would you like to be contacted?
            </Text>

            <Form<{ contact_preference: ContactPreferenceType }>
              defaultValues={{
                contact_preference: member?.contact_preference || 'email'
              }}
              onSubmit={mutate}
              onSuccess={() => setComplete(true)}
            >
              {() => (
                <VStack
                  alignItems="center"
                  align="center"
                  justify="middle"
                  textAlign="center"
                  mt={8}
                >
                  <FieldRadioButtons
                    w="fit-content"
                    field="contact_preference"
                    registerOptions={{
                      required: 'Certification is Required'
                    }}
                    options={[
                      { text: 'Email', value: 'email' },
                      { text: 'Phone', value: 'phone_call' },
                      { text: 'Text', value: 'phone_text' }
                    ]}
                  />
                  <BusyButton
                    type="submit"
                    mt={8}
                    size="lg"
                    bgColor="accent.500"
                  >
                    Set Contact Preference
                  </BusyButton>
                </VStack>
              )}
            </Form>
          </>
        )}
        {complete && (
          <Alert
            color="white"
            my={8}
            status="success"
            alignItems="start"
            justifyContent="center"
            py={8}
            rounded="lg"
            shadow="lg"
          >
            <AlertIcon />
            <Text m={0}>
              Your application is currently being reviewed by our team. You will
              receive an email with our decision within 7 days. <br />
              Thank you for your interest in our fraternity.
            </Text>
          </Alert>
        )}
      </>
    </Page>
  )
}
export default Review
