import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  FieldCheckboxes,
  FieldInput,
  FieldRadioButtons,
  FieldSelect,
  FieldSwitch,
  FieldWrapper,
  Form
} from 'components/forms'
import Page from 'components/Page'
import { useUser } from 'hooks/use-user'
import { FieldMap, Member, MemberLevel } from 'lib/models'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react'
import { LocationCapture } from '../../../components/controls/LocationCapture'

export type PageProps = {
  fieldMap: FieldMap
  section?: string
}

export async function getServerSideProps(context) {
  if (context?.params == undefined)
    return {
      redirect: {
        destination: `/member/settings/${PageSection[0]}`,
        permanent: false
      }
    }
  const { section } = context.params
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')
  const props: PageProps = {
    fieldMap
  }
  if (section) {
    props.section = String(section)
  }
  return {
    props
  }
}

export default function SettingsPage(props: PageProps) {
  const { member, loading } = useUser({ minLevel: MemberLevel.pledge })
  return (
    <Page title="Settings" loading={loading} requireAuth={true}>
      {member && <SettingsForm {...props} />}
    </Page>
  )
}

type SettingsProp = Pick<
  Member,
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'city'
  | 'state'
  | 'birth_month'
  | 'birth_year'
  | 'contact_preference'
  | 'allow_messages'
  | 'photo_consent'
  | 'video_consent'
  | 'needs_guidance'
  | 'event_invites'
  | 'social_scenes'
  | 'event_availability'
  | 'their_positions'
  | 'their_roles'
  | 'their_spectrum'
  | 'their_relationship_status'
  | 'show_profile'
  | 'show_interests'
  | 'show_contact'
  | 'show_events'
  | 'show_location'
  | 'auth_with_phone'
  | 'can_host'
>

enum PageSection {
  contact,
  events,
  interests,
  location
}

function SettingsForm({ fieldMap, section: s = 'contact' }: PageProps) {
  const router = useRouter()
  const section = PageSection[s]
  const [tabValue, setTabValue] = useState(section)
  const { member, mutate, hasFeature } = useUser()

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }

  const setSection = useCallback(
    (tab: number) => {
      if (tab != tabValue) {
        setTabValue(tab)
        router.push(`/member/settings/${PageSection[tab]}`)
      }
    },
    [router, tabValue]
  )

  const {
    email,
    phone,
    city,
    state,
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
    show_events,
    auth_with_phone,
    show_location
  } = member
  const defaultValues = {
    show_location,
    email,
    phone,
    city,
    state,
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
    show_events,
    auth_with_phone
  }

  const required = { value: true, message: 'Required' }
  return (
    <>
      <Form<SettingsProp>
        onSubmit={mutate}
        defaultValues={defaultValues}
        successMessage="Your settings were updated."
      >
        {({ watch, formState: { isDirty, isSubmitting }, register }) => (
          <>
            <Tabs
              isFitted
              fontSize={{ base: 'sm', md: 'lg' }}
              defaultIndex={tabValue}
              onChange={(index) => setSection(index)}
            >
              <TabList>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 0 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Contact
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 1 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Events
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 2 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Interests
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 3 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Location
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} py={4}>
                  {watch('show_profile') && (
                    <Alert
                      bg="primary"
                      color="white"
                      flexDirection="column"
                      my={4}
                      p={4}
                      borderRadius="md"
                      shadow="md"
                      gap={4}
                    >
                      <Text w="full" mb={2}>
                        You can display your email and phone number to other
                        members if you want, by enabling this setting.
                      </Text>
                      <FieldSwitch
                        mt={4}
                        field="show_contact"
                        label="Show Contact Info"
                        help="Turn this on if you want display your contact information to other members."
                      />
                    </Alert>
                  )}

                  <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                    <FieldInput
                      field="email"
                      label="Email"
                      type="email"
                      registerOptions={{ required }}
                      readOnly={true}
                    />
                    <FieldInput
                      field="phone"
                      label="Mobile Phone"
                      registerOptions={{
                        pattern: {
                          value:
                            /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                          message: 'US numbers only. Format: 123 456 7890'
                        }
                      }}
                      placeholder="000 456 7890"
                    />
                  </SimpleGrid>
                  <SimpleGrid spacing={4} my={4} columns={[1, 2]}>
                    <FieldSelect
                      w="full"
                      field="contact_preference"
                      label="Staff Contact Preference"
                      options={getOptions('contact_preference')}
                      help="This is your preference for how the staff may contact you."
                    />
                    <FieldSelect
                      mt={4}
                      field="allow_messages"
                      label="Messaging Preference"
                      options={getOptions('allow_messages')}
                      help="This is your preference for how other members may contact you via in-app messaging."
                    />
                  </SimpleGrid>
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
                        If you choose to only receive messages from staff, you
                        will not be able to send messages to other members.
                      </Text>
                    </Alert>
                  )}
                </TabPanel>
                <TabPanel px={0} py={4}>
                  <Alert
                    bg="primary"
                    color="white"
                    flexDirection="column"
                    mb={4}
                    p={4}
                    borderRadius="md"
                    shadow="md"
                    gap={4}
                  >
                    <Text w="full" textAlign="left">
                      These settings let us know which events you are interested
                      in attending. our system will auto-match you with events
                      that meet your interests. You can also manually RSVP to
                      events that interest you.
                    </Text>
                    <Stack
                      mt={4}
                      direction={{ base: 'column', md: 'row' }}
                      spacing={2}
                    >
                      <FieldSwitch
                        field="event_invites"
                        label="Get Invites to Events"
                        help="Turn this on, if you want to be invited to events that meet your interests."
                      />
                      {watch('show_profile') && (
                        <FieldSwitch
                          field="show_events"
                          label="Show Event Interests"
                          help="Turn this on, if you want to show your event interests on your profile."
                        />
                      )}
                      {watch('event_invites') && (
                        <FieldSwitch
                          field="needs_guidance"
                          help="Nervous, New or Differently-abled? Our staff will reach out to you to help guide you at your first event."
                          label="Request Guidance"
                        />
                      )}
                    </Stack>
                  </Alert>

                  <SimpleGrid spacing={4}>
                    <FieldCheckboxes
                      field="social_scenes"
                      label="Social Activities"
                      help="We host events to meet the demands of our brothers. Tell us what kind of events you are interested in."
                      options={getOptions('social_scenes')}
                      includeOther
                    />
                    <Alert
                      bg="primary.300"
                      color="white"
                      my={4}
                      borderRadius="md"
                      shadow="md"
                    >
                      <Stack direction={'column'} spacing={2}>
                        <Text w="full" textAlign="left">
                          <strong>Are you an exhibitionist?</strong> If so, you
                          can opt-in to be a part of our marketing efforts. We
                          will never share your personal information with
                          anyone.
                        </Text>
                        <Stack
                          mt={4}
                          direction={{ base: 'column', md: 'row' }}
                          spacing={2}
                        >
                          <FieldSwitch
                            field="photo_consent"
                            label="Photo Consent"
                            help="I would be willing to be photographed and featured in our promotional materials."
                          />
                          <FieldSwitch
                            field="video_consent"
                            label="Video Consent"
                            help="I would be willing to filmed for a video testimonial."
                          />
                        </Stack>
                      </Stack>
                    </Alert>
                    <FieldCheckboxes
                      field="event_availability"
                      label="Preferred Event Times"
                      help="We host events to meet the demands of our brothers. Let us know what times work best in general"
                      options={getOptions('event_availability')}
                    />
                  </SimpleGrid>

                  {watch('event_invites') && (
                    <Alert
                      bg="primary.300"
                      color="white"
                      my={4}
                      borderRadius="md"
                      shadow="md"
                    >
                      <Stack direction={'column'} spacing={2}>
                        <Text w="full" textAlign="left">
                          <strong>Are you interested in hosting?</strong> If so,
                          let us know by checking the box below. We are always
                          looking for new hosts.
                        </Text>
                        <Stack direction="column" spacing={2} mt={4}>
                          <FieldSwitch
                            field="can_host"
                            label="Can Host Events"
                          />
                          {watch('can_host') && (
                            <FieldCheckboxes
                              field="can_host_events"
                              label="Events"
                              options={getOptions('can_host_events')}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Alert>
                  )}
                </TabPanel>
                <TabPanel px={0} py={4}>
                  {watch('show_profile') && (
                    <Alert
                      bg={'primary'}
                      color="white"
                      flexDirection="column"
                      my={4}
                      p={4}
                      borderRadius="md"
                      shadow="md"
                      gap={4}
                    >
                      <Text w="full" textAlign="left">
                        What are you looking for and compatible with? We use
                        this information to optimize compatibility for events.
                        If you choose to display this info, other members can
                        find you based on these attributes.
                      </Text>
                      <FieldSwitch
                        mt={4}
                        field="show_interests"
                        label="Show Interests "
                        help="Turn this off, if you'd prefer to not display this information to other verified members."
                      />
                    </Alert>
                  )}
                  <SimpleGrid spacing={4}>
                    <FieldCheckboxes
                      field="their_spectrum"
                      label="Their Orientation"
                      options={getOptions('their_spectrum')}
                    />
                    <FieldCheckboxes
                      field="their_relationship_status"
                      label="Their Relationship Status"
                      options={getOptions('their_relationship_status')}
                    />

                    <FieldCheckboxes
                      field="their_positions"
                      label="Their Sexual Positions"
                      options={getOptions('their_positions')}
                    />

                    <FieldCheckboxes
                      field="their_roles"
                      label="Their Sexual Roles"
                      options={getOptions('their_roles')}
                    />
                  </SimpleGrid>
                </TabPanel>
                <TabPanel px={0}>
                  {watch('show_profile') && (
                    <Alert
                      bg={'primary'}
                      color="white"
                      flexDirection="column"
                      my={4}
                      p={4}
                      borderRadius="md"
                      shadow="md"
                      gap={4}
                    >
                      <Text w="full" textAlign="left">
                        Display your location information to make it easier for
                        people to find other brothers near them.
                      </Text>
                      <Flex gap={2} w="full">
                        <FieldSwitch
                          mt={4}
                          field="show_location"
                          label="Show Location "
                          help="Turn this off, if you'd prefer to not display this information to other verified members."
                        />
                        {watch('show_location') && <LocationCapture />}
                      </Flex>
                    </Alert>
                  )}

                  <SimpleGrid spacing={4}>
                    <FieldWrapper label="City / State">
                      <InputGroup>
                        <Input {...register('city')} w={'65%'} mr={2} />
                        <Select {...register('state')} w={'35%'}>
                          {getOptions('state').map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.text}
                            </option>
                          ))}
                        </Select>
                      </InputGroup>
                    </FieldWrapper>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Box
              backdropFilter="blur(2px)"
              position="sticky"
              h="80px"
              w="full"
              bottom={0}
            ></Box>
            <Button
              mt={-10}
              size="lg"
              type="submit"
              bg="primary"
              color="white"
              disabled={isSubmitting || !isDirty}
              position="sticky"
              bottom={4}
              w={['full', 'full', 'auto']}
              _hover={{ bg: 'accent.500' }}
            >
              Update Settings
            </Button>
          </>
        )}
      </Form>
    </>
  )
}
