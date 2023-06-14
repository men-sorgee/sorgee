import { useState } from 'react'

import { ConnectForm, Form } from 'components/forms'
import Page from 'components/Page'
import { useUser } from 'hooks/use-user'
import { FieldMap, Member, MemberLevel } from 'lib/models'
import { NextPageContext } from 'next'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  SimpleGrid,
  Spacer,
  Text
} from '@chakra-ui/react'

type PageProps = {
  fieldMap: FieldMap
}

export async function getServerSideProps(_context: NextPageContext) {
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')
  return {
    props: {
      fieldMap
    }
  }
}

export default function SettingsPage(props: PageProps) {
  const { member, loading } = useUser({ minLevel: MemberLevel.pledge })
  return (
    <Page title="Account" loading={loading} requireAuth={true}>
      {member && <AccountForm {...props} />}
    </Page>
  )
}

function AccountForm({ fieldMap }: PageProps) {
  const [tabValue, setTabValue] = useState(0)
  const { member, mutate } = useUser()

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    birth_month,
    birth_year,
    contact_preference,
    allow_messages,
    photo_consent,
    video_consent,
    needs_guidance,
    social_scenes,
    event_invites,
    event_availability,
    their_positions,
    their_roles,
    their_spectrum,
    their_relationship_status,
    show_profile,
    show_interests,
    show_contact,
    show_events
  } = member
  const defaultValues = {
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    birth_month,
    birth_year,
    contact_preference,
    allow_messages,
    photo_consent,
    video_consent,
    needs_guidance,
    event_invites,
    social_scenes,
    event_availability,
    their_positions,
    their_roles,
    their_spectrum,
    their_relationship_status,
    show_profile,
    show_interests,
    show_contact,
    show_events
  }

  const required = { value: true, message: 'Required' }
  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21
  let canHost: boolean = false
  let eventInvites: boolean = false
  let showProfile: boolean = false
  let allowMessages: Member['allow_messages'] = 'anyone'
  return (
    <>
      <Form<Member>
        onSubmit={mutate}
        defaultValues={defaultValues}
        successMessage="Your settings were updated."
      >
        <ConnectForm>
          {({ watch, formState: { isDirty, isSubmitting }, register }) => (
            <>
              <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}></SimpleGrid>

              {watch('allow_messages') == 'staff' && (
                <Alert
                  status="warning"
                  flexDirection="row"
                  my={4}
                  p={4}
                  borderRadius="md"
                >
                  <AlertIcon />
                  <Text>
                    If you choose to only receive messages from staff, you will
                    not be able to send messages to other members.
                  </Text>
                </Alert>
              )}

              <Box
                backdropFilter="blur(2px)"
                position="sticky"
                h="80px"
                w="full"
                bottom={0}
              ></Box>
              <HStack position="relative">
                <Button
                  size="lg"
                  type="submit"
                  bg="primary"
                  color="white"
                  disabled={isSubmitting || !isDirty}
                  position="sticky"
                  bottom={4}
                  _hover={{ bg: 'accent.500' }}
                >
                  Update Account
                </Button>
                <Spacer />
                <Button
                  size="lg"
                  type="submit"
                  bg="red.300"
                  color="white"
                  disabled={isSubmitting || !isDirty}
                  position="sticky"
                  bottom={4}
                  _hover={{ bg: 'red.500' }}
                >
                  Cancel Account & Delete Data
                </Button>
              </HStack>
            </>
          )}
        </ConnectForm>
      </Form>
    </>
  )
}
