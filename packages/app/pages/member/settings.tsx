import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldMap, User } from 'lib/models'
import { useUser } from '@/hooks/use-user'
import { useState } from 'react'
import {
  FieldInput,
  FieldSelect,
  FieldWrapper,
  FieldCheckboxes,
  FieldCheckbox,
  FieldSwitch,
} from 'components/forms'
import {
  Alert,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Text,
  Select,
  SimpleGrid,
  Input,
  InputGroup,
  Box,
  useToast,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useWarnIfUnsavedChanges } from 'hooks/use-warn-if-unsaved'

type PageProps = {
  fieldMap: FieldMap
}

export async function getServerSideProps(_context: NextPageContext) {
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')
  return {
    props: {
      fieldMap,
    },
  }
}

type MemberFormData = Partial<User>

export default function SettingsPage(props: PageProps) {
  const { member, loading } = useUser()
  return (
    <Page title="Settings" loading={loading} requireAuth={true}>
      {member && <Form {...props} />}
    </Page>
  )
}

function Form({ fieldMap }: PageProps) {
  const toast = useToast()
  const { member, mutate } = useUser()

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }

  const [tabValue, setTabValue] = useState(0)

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
    photo_consent,
    video_consent,
    needs_guidance,
    event_invites: invites,
    social_scenes: scenes,
    event_availability,
    their_positions,
    their_roles,
    their_spectrum,
    their_relationship_status,
    show_profile: profile,
    show_interests: interests,
    show_contact: contact,
    show_events: events,
  } = member
  const methods = useForm<MemberFormData>({
    mode: 'onBlur',
    defaultValues: {
      first_name,
      last_name,
      email,
      phone,
      city,
      state,
      birth_month,
      birth_year,
      contact_preference,
      photo_consent,
      video_consent,
      needs_guidance,
      event_invites: invites,
      social_scenes: scenes,
      event_availability,
      their_positions,
      their_roles,
      their_spectrum,
      their_relationship_status,
      show_profile: profile,
      show_interests: interests,
      show_contact: contact,
      show_events: events,
    },
  })
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods

  useWarnIfUnsavedChanges(isDirty, () => {
    return window.confirm('Are you sure you want to leave? You have unsaved changes.')
  })

  const onSubmit = async (data: MemberFormData) => {
    const [r, error] = await mutate(data)
    const ok = r && !error

    if (ok) {
      toast({
        title: 'Success',
        description: 'Your account was updated.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        onCloseComplete: () => {
          reset(r as any)
        },
      })
    } else if (error?.field) {
      // @ts-ignore
      setError(error!.field, error.message)
    } else {
      toast({
        title: 'Error',
        description: `Something went wrong ${error.message || error}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const required = { value: true, message: 'Required' }
  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21
  const can_host = watch('can_host')
  const event_invites = watch('event_invites')
  const show_profile = watch('show_profile')
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            isFitted
            fontSize={{ base: 'sm', md: 'lg' }}
            defaultIndex={tabValue}
            onChange={(index) => setTabValue(index)}
          >
            <TabList>
              <Tab fontSize={['md', 'lg', '2xl']} fontWeight={tabValue == 0 ? 'bold' : null}>
                Contact
              </Tab>
              <Tab fontSize={['md', 'lg', '2xl']} fontWeight={tabValue == 1 ? 'bold' : null}>
                Events
              </Tab>
              <Tab fontSize={['md', 'lg', '2xl']} fontWeight={tabValue == 2 ? 'bold' : null}>
                Interests{' '}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0} pt={4}>
                {show_profile && (
                  <Alert
                    bg="primary"
                    color="white"
                    flexDirection="column"
                    my={4}
                    p={4}
                    borderRadius="md"
                    shadow="md"
                  >
                    <Text w="full" mb={2}>
                      This information is private by default, but you can opt to display it if you
                      choose.
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
                    field="first_name"
                    label="First Name"
                    registerOptions={{ required }}
                  />
                  <FieldInput field="last_name" label="Last Name" registerOptions={{ required }} />
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
                        value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                        message: 'US numbers only. Format: 123 456 7890',
                      },
                    }}
                    placeholder="000 456 7890"
                  />

                  <FieldInput field="city" label="City" />
                  <FieldSelect field="state" label="State" options={getOptions('state')} />

                  <FieldWrapper field="birth_month" label="Birth Month/Year">
                    <InputGroup>
                      <Select
                        mr={2}
                        {...register('birth_month', {
                          required: 'You must provide your month of birth',
                        })}
                      >
                        {getOptions('birth_month').map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.text}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        min={minYear}
                        max={maxYear}
                        step={1}
                        {...register('birth_year', {
                          required: 'You must provide your year of birth',
                        })}
                      />
                    </InputGroup>
                  </FieldWrapper>

                  <FieldSelect
                    w="full"
                    field="contact_preference"
                    label="Contact Preference"
                    options={getOptions('contact_preference')}
                  />
                </SimpleGrid>

                <Alert bg="primary.300" color="white" my={4} borderRadius="md" shadow="md">
                  <Stack direction={'column'} spacing={2}>
                    <Text>
                      <strong>Are you an exhibitionist?</strong> If so, you can opt-in to be a part
                      of our marketing efforts. We will never share your personal information with
                      anyone.
                    </Text>
                    <Stack mt={4} direction={{ base: 'column', md: 'row' }} spacing={2}>
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
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldCheckbox
                    field="needs_guidance"
                    help="Our staff will reach out to you to help guide you along the way."
                    label="Request Guidance"
                  >
                    I need assistance
                  </FieldCheckbox>
                  <FieldSelect
                    mt={4}
                    field="allow_messages"
                    label="Allow Direct Messages"
                    options={getOptions('allow_messages')}
                  />
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
                <Alert
                  bg="primary"
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text>
                    These settings let us know which events you are interested in attending. our
                    system will auto-match you with events that meet your interests. You can also
                    manually RSVP to events that interest you.
                  </Text>
                  <Stack mt={4} direction={{ base: 'column', md: 'row' }} spacing={2}>
                    <FieldSwitch
                      field="event_invites"
                      label="Get Invites to Events"
                      help="Turn this on, if you want to be invited to events that meet your interests."
                    />
                    {show_profile && (
                      <FieldSwitch
                        field="show_events"
                        label="Show Event Interests"
                        help="Turn this on, if you want to show your event interests on your profile."
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

                  <FieldCheckboxes
                    field="event_availability"
                    label="Preferred Event Times"
                    help="We host events to meet the demands of our brothers. Let us know what times work best in general"
                    options={getOptions('event_availability')}
                  />
                </SimpleGrid>

                {event_invites && (
                  <Alert bg="primary.300" color="white" my={4} borderRadius="md" shadow="md">
                    <Stack direction={'column'} spacing={2}>
                      <Text>
                        <strong>Are you interested in hosting?</strong> If so, let us know by
                        checking the box below. We are always looking for new hosts.
                      </Text>
                      <Stack direction="column" spacing={2} mt={4}>
                        <FieldSwitch field="can_host" label="Can Host Events" />
                        {can_host && (
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
              <TabPanel p={0} pt={4}>
                {show_profile && (
                  <Alert
                    bg={'primary'}
                    color="white"
                    flexDirection="column"
                    my={4}
                    p={4}
                    borderRadius="md"
                    shadow="md"
                  >
                    <Text>
                      What are you looking for and compatible with? We use this information to
                      optimize compatibility for events. If you choose to display this info, other
                      members can find you based on these attributes.
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
            </TabPanels>
          </Tabs>

          <input type="hidden" {...register('id')} />

          <Box backdropFilter="blur(2px)" position="sticky" h="80px" w="full" bottom={0}></Box>
          <Button
            mt={-10}
            size="lg"
            type="submit"
            bg="primary"
            color="white"
            disabled={isSubmitting || !isDirty}
            position="sticky"
            bottom={4}
          >
            Update Settings
          </Button>
        </form>
      </FormProvider>
    </>
  )
}
