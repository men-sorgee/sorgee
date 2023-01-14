import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FormOptions, User } from 'lib/models'
import { getFieldOptions } from 'lib/services/directus/server'
import { useMember } from 'hooks/use-member'
import { useEffect, useState } from 'react'
import {
  FieldInput,
  FieldSelect,
  FieldWrapper,
  FieldText,
  FieldCheckboxes,
  FieldCheckbox,
  FieldSwitch,
} from 'components/forms'
import {
  Alert,
  Button,
  Tabs,
  Heading,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Text,
  HStack,
  SimpleGrid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
  Avatar,
  VStack,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import { postJSON } from 'lib/utils'

import { UserCard } from 'components/ui'

export type PageProps = {
  spectrumOptions: FormOptions
  relationshipOptions: FormOptions
  timeOfDayOptions: FormOptions
  positionsOptions: FormOptions
  skinToneOptions: FormOptions
  hairColorOptions: FormOptions
  hairStyleOptions: FormOptions
  eyeColorOptions: FormOptions
  mannerismsOptions: FormOptions
  bodyHairOptions: FormOptions
  bodyAttributesOptions: FormOptions
  facialHairOptions: FormOptions
  scenesOptions: FormOptions
  eventOptions: FormOptions
  cockGirthOptions: FormOptions
  cockAttributesOptions: FormOptions
  ballSizeOptions: FormOptions
  ballGravityOptions: FormOptions
  cumAttributesOptions: FormOptions
  loadPolicyOptions: FormOptions
  hivStatusOptions: FormOptions
  vaccinationStatusOptions: FormOptions
  contactPreferenceOptions: FormOptions
  myRolesOptions: FormOptions
  theirRolesOptions: FormOptions
  theirSpectrumOptions: FormOptions
  theirPositionsOptions: FormOptions
  hostEventOptions: FormOptions
}

export async function getServerSideProps(_context: NextPageContext) {
  const props: PageProps = {
    spectrumOptions: await getFieldOptions<User>('spectrum'),
    relationshipOptions: await getFieldOptions<User>('relationship_status'),
    timeOfDayOptions: await getFieldOptions<User>('event_availability'),
    positionsOptions: await getFieldOptions<User>('my_positions'),
    skinToneOptions: await getFieldOptions<User>('skin_tone'),
    hairColorOptions: await getFieldOptions<User>('hair_color'),
    hairStyleOptions: await getFieldOptions<User>('hair_style'),
    eyeColorOptions: await getFieldOptions<User>('eye_color'),
    mannerismsOptions: await getFieldOptions<User>('mannerisms'),
    bodyHairOptions: await getFieldOptions<User>('body_hair'),
    bodyAttributesOptions: await getFieldOptions<User>('body_attributes'),
    facialHairOptions: await getFieldOptions<User>('facial_hair'),
    scenesOptions: await getFieldOptions<User>('sexual_scenes'),
    eventOptions: await getFieldOptions<User>('social_scenes'),
    cockGirthOptions: await getFieldOptions<User>('cock_girth'),
    cockAttributesOptions: await getFieldOptions<User>('cock_attributes'),
    ballSizeOptions: await getFieldOptions<User>('ball_size'),
    ballGravityOptions: await getFieldOptions<User>('ball_gravity'),
    cumAttributesOptions: await getFieldOptions<User>('cum_attributes'),
    loadPolicyOptions: await getFieldOptions<User>('load_policy'),
    hivStatusOptions: await getFieldOptions<User>('hiv_status'),
    vaccinationStatusOptions: await getFieldOptions<User>('vaccinations'),
    contactPreferenceOptions: await getFieldOptions<User>('contact_preference'),
    myRolesOptions: await getFieldOptions<User>('my_roles'),
    hostEventOptions: await getFieldOptions<User>('can_host_events'),
    theirRolesOptions: await getFieldOptions<User>('their_roles'),
    theirSpectrumOptions: await getFieldOptions<User>('their_spectrum'),
    theirPositionsOptions: await getFieldOptions<User>('their_positions'),
  }
  return { props }
}

type MemberFormData = User & {
  height_feet: string
  height_inches: string
}

function Account(props: PageProps) {
  const { member, loading } = useMember()
  return (
    <Page title="Account" loading={loading} requireAuth={true} header={<UserCard />}>
      {member && <Form {...props} />}
    </Page>
  )
}

function Form(props: PageProps) {
  const toast = useToast()
  const { member, reload, loading } = useMember()
  const router = useRouter()
  const {
    spectrumOptions,
    positionsOptions,
    relationshipOptions,
    skinToneOptions,
    hairColorOptions,
    hairStyleOptions,
    eyeColorOptions,
    mannerismsOptions,
    bodyHairOptions,
    bodyAttributesOptions,
    facialHairOptions,
    timeOfDayOptions,
    scenesOptions,
    eventOptions,
    cockGirthOptions,
    cockAttributesOptions,
    ballSizeOptions,
    ballGravityOptions,
    cumAttributesOptions,
    loadPolicyOptions,
    hivStatusOptions,
    vaccinationStatusOptions,
    contactPreferenceOptions,
    myRolesOptions,
    hostEventOptions,
    theirRolesOptions,
    theirSpectrumOptions,
    theirPositionsOptions,
  } = props
  const [tabValue, setTabValue] = useState(Number(router.query.t) || 0)
  const [height_feet, setHeightFeet] = useState<string | null>()
  const [height_inches, setHeightInches] = useState<string | null>()

  useEffect(() => {
    if (!loading && member && !height_feet && !height_inches) {
      setHeightFeet(member?.height?.toString().substring(0, 1) || '')
      setHeightInches(member?.height?.toString().substring(2) || '')
    }
  }, [loading, member, height_feet, height_inches])

  const methods = useForm<MemberFormData>({
    mode: 'onBlur',
    defaultValues: {
      ...member,
      height_feet,
      height_inches,
    },
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods

  useEffect(() => {
    if (tabValue !== Number(router.query.t || 0)) router.push(`/member/account?t=${tabValue}`)
  }, [router, tabValue])

  async function onSubmit(data: MemberFormData) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet} ${data.height_inches}`
    }

    const [ok, response] = await postJSON<User>('/api/member/me', data)

    if (ok) {
      toast({
        title: 'Success',
        description: 'Your account and profile are updated.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      reload()
    } else if (response.error?.field) {
      // @ts-ignore
      setError(response.error!.field, response.error.message)
    } else {
      setError('form' as any, { message: 'Something went wrong' })
    }
  }

  const required = { value: true, message: 'Required' }
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs isFitted defaultIndex={tabValue} onChange={(index) => setTabValue(index)}>
            <TabList fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
              <Tab fontWeight="bold">Private</Tab>
              <Tab fontWeight="bold">Events</Tab>
              <Tab fontWeight="bold">Profile</Tab>
              <Tab fontWeight="bold" display={{ base: 'none', md: 'inherit' }}>
                Interests
              </Tab>
              <Tab fontWeight="bold" display={{ base: 'none', md: 'inherit' }}>
                Attractions
              </Tab>
              <Tab fontWeight="bold">Health</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <Alert
                  bg={['primary.200', 'primary.700']}
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text w={['full']}>
                    This information is private and can not be seen by any other member. It is used
                    only for administrative purposes.
                  </Text>
                </Alert>
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
                  <FieldInput field="state" label="State" value="Colorado" readOnly />

                  <FieldCheckbox
                    field="needs_guidance"
                    help="Our staff will reach out to you to help guide you along the way."
                    label="Request Guidance"
                  >
                    Yes
                  </FieldCheckbox>
                  <FieldSelect
                    w="full"
                    field="contact_preference"
                    label="Contact Preference"
                    formOptions={contactPreferenceOptions}
                  />
                </SimpleGrid>

                <Alert bg="secondary" color="white" my={4} borderRadius="md" shadow="md">
                  <Stack direction={'column'} spacing={2}>
                    <Text>
                      <strong>Are you an exhibitionist?</strong> If so, you can opt-in to be a part
                      of our marketing efforts. We will never share your personal information with
                      anyone.
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
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
              </TabPanel>
              <TabPanel p={0}>
                <Alert
                  bg={['primary.200', 'primary.700']}
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
                  <FieldSwitch
                    field="event_invites"
                    label="Get Invites to Events"
                    help="Turn this on, if you want to be invited to events that meet your interests."
                  />
                </Alert>
                <SimpleGrid spacing={4}>
                  <FieldCheckboxes
                    field="social_scenes"
                    label="Social Activities"
                    help="We host events to meet the demands of our brothers. Tell us what kind of events you are interested in."
                    formOptions={eventOptions}
                  />

                  <FieldCheckboxes
                    field="event_availability"
                    label="Preferred Event Times"
                    help="We host events to meet the demands of our brothers. Let us know what times work best in general"
                    formOptions={timeOfDayOptions}
                  />
                </SimpleGrid>
                <Text>
                  Members who RSVP to events are expected to attend. Members that RSVP to event and
                  do not attend, decrease the likelihood of getting invited again. We understand
                  that things come up, but please be respectful of your brothers and RSVP accurately
                  and let us know if you can&apos;t make it.
                </Text>
                <Alert bg="secondary" color="white" my={4} borderRadius="md" shadow="md">
                  <Stack direction={'column'} spacing={2}>
                    <Text>
                      <strong>Are you interested in hosting?</strong> If so, let us know by checking
                      the box below. We are always looking for new hosts.
                    </Text>
                    <Stack direction="column" spacing={2}>
                      <FieldSwitch field="can_host" label="Can Host Events" />
                      <FieldCheckboxes
                        field="can_host_events"
                        label="Events"
                        formOptions={hostEventOptions}
                      />
                    </Stack>
                  </Stack>
                </Alert>
              </TabPanel>
              <TabPanel p={0}>
                <Alert
                  bg={['primary.200', 'primary.700']}
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text w={['full']}>
                    This is your profile. Other verified members are able to see this information.
                    You can also choose to make your profile private.
                  </Text>
                  <FieldSwitch
                    field="show_profile"
                    label="Show Profile"
                    help="Turn this on, if you are okay showing this information to other verified members."
                  />
                </Alert>
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <GridItem colSpan={{ base: 1, sm: 2 }}>
                    <FieldInput
                      field="nickname"
                      label="Nickname"
                      className="col-span-2 sm:col-span-4"
                    />
                  </GridItem>
                  <FieldSelect field="spectrum" label="Orientation" formOptions={spectrumOptions} />
                  <FieldSelect
                    field="relationship_status"
                    label="Relationship Status"
                    formOptions={relationshipOptions}
                  />
                </SimpleGrid>
                <FieldText
                  field="biography"
                  label="Biography"
                  help="Tell us about yourself. What are your interests? What are you looking for?"
                  rows={4}
                  placeholder="I am a bit shy, but love to get aggressive in bed."
                />
                <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 4 }}>
                  <GridItem colSpan={{ base: 1, sm: 2 }}>
                    <Stack direction={{ base: 'column', sm: 'row' }}>
                      <FieldWrapper field="height" label="Height">
                        <InputGroup>
                          <Input type="number" id="height_feet" {...register('height_feet')} />
                          <InputRightAddon mr={2}>&apos;</InputRightAddon>
                          <Input type="number" id="height_inches" {...register('height_inches')} />
                          <InputRightAddon>&quote;</InputRightAddon>
                        </InputGroup>
                      </FieldWrapper>

                      <FieldInput field="weight" label="Weight" type="number" />
                    </Stack>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, sm: 2 }}>
                    <Stack direction={{ base: 'column', sm: 'row' }}>
                      <FieldInput
                        field="age"
                        label="Age"
                        help="Must be 21+ to apply. We verify ages at events."
                        registerOptions={{
                          required,
                          min: {
                            value: 21,
                            message: 'Must be 21+ to apply.',
                          },
                        }}
                      />
                      <FieldSelect
                        field="skin_tone"
                        label="Skin Tone"
                        formOptions={skinToneOptions}
                      />
                    </Stack>
                  </GridItem>
                  <GridItem colSpan={{ base: 1, sm: 2, md: 4 }}>
                    <FieldCheckboxes
                      field="body_attributes"
                      label="Body Attributes"
                      formOptions={bodyAttributesOptions}
                    />
                  </GridItem>

                  <FieldSelect
                    field="hair_color"
                    label="Hair Color"
                    formOptions={hairColorOptions}
                  />
                  <FieldSelect
                    field="hair_style"
                    label="Hair Style"
                    formOptions={hairStyleOptions}
                  />
                  <FieldSelect field="body_hair" label="Body Hair" formOptions={bodyHairOptions} />
                  <FieldSelect
                    field="facial_hair"
                    label="Facial Hair"
                    formOptions={facialHairOptions}
                  />
                  <FieldSelect field="eye_color" label="Eye Color" formOptions={eyeColorOptions} />
                  <FieldSelect
                    field="mannerisms"
                    label="Mannerisms"
                    formOptions={mannerismsOptions}
                  />

                  <FieldInput
                    field="cock_length"
                    label="Cock Length"
                    type="number"
                    registerOptions={{}}
                  />
                  <FieldSelect
                    field="cock_girth"
                    label="Cock Girth"
                    formOptions={cockGirthOptions}
                  />
                </SimpleGrid>
                <FieldCheckboxes
                  field="cock_attributes"
                  label="Cock Attributes"
                  className="sm:col-span-2"
                  formOptions={cockAttributesOptions}
                />
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldSelect field="ball_size" label="Ball Size" formOptions={ballSizeOptions} />
                  <FieldSelect
                    field="ball_gravity"
                    label="Ball Gravity"
                    formOptions={ballGravityOptions}
                  />
                </SimpleGrid>
                <FieldCheckboxes
                  field="cum_attributes"
                  label="Cum Attributes"
                  className="sm:col-span-2"
                  formOptions={cumAttributesOptions}
                />
              </TabPanel>

              <TabPanel p={0}>
                <Alert
                  bg={['primary.200', 'primary.700']}
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text>
                    Your sexual interests help us match you with other members and is visible with
                    your profile. Members can search for other members based on these attributes.
                  </Text>
                  <FieldSwitch
                    field="show_interests"
                    label="Show Interests "
                    help="Turn this on, if you are okay showing this information to other verified members."
                  />
                </Alert>
                <SimpleGrid spacing={4}>
                  <FieldCheckboxes
                    field="my_positions"
                    label="My Sexual Positions"
                    formOptions={positionsOptions}
                  />
                  <FieldCheckboxes
                    field="my_roles"
                    label="My Sexual Roles"
                    formOptions={myRolesOptions}
                  />
                  <FieldCheckboxes
                    field="sexual_scenes"
                    label="Sexual Scenes"
                    formOptions={scenesOptions}
                  />
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
                <Alert
                  bg={['primary.200', 'primary.700']}
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text>
                    What are you attracted to and/or compatible with? We will use this information
                    to optimize compatibilty for events. Other members will not see this
                    information.
                  </Text>
                </Alert>
                <SimpleGrid spacing={4}>
                  <FieldCheckboxes
                    field="their_spectrum"
                    label="Their Orientation"
                    formOptions={theirSpectrumOptions}
                  />
                  <FieldCheckboxes
                    field="their_relationship_status"
                    label="Their Relationship Status"
                    formOptions={relationshipOptions}
                  />

                  <FieldCheckboxes
                    field="their_positions"
                    label="Their Sexual Positions"
                    formOptions={theirPositionsOptions}
                  />

                  <FieldCheckboxes
                    field="their_roles"
                    label="Their Sexual Roles"
                    formOptions={theirRolesOptions}
                  />
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
                <Alert
                  bg={['primary.200', 'primary.700']}
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text>
                    This is your health information. Other verified members are able to see this
                    information if you choose to show it. If you are not comfortable sharing this
                    information, you can choose to hide it.
                  </Text>
                  <FieldSwitch
                    field="show_health"
                    label="Show Health Information"
                    help="Turn this on, if you are okay showing this information to other verified members."
                  />
                </Alert>
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldSelect
                    field="hiv_status"
                    label="HIV Status"
                    formOptions={hivStatusOptions}
                  />
                  <FieldInput field="last_tested" label="Last Tested" type="date" />
                </SimpleGrid>
                <SimpleGrid spacing={4}>
                  <FieldCheckboxes
                    field="load_policy"
                    label="Load Policy"
                    formOptions={loadPolicyOptions}
                  />
                  <FieldCheckboxes
                    field="vaccinations"
                    label="Vax Status"
                    formOptions={vaccinationStatusOptions}
                  />
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <input type="hidden" {...register('id')} />

          <VStack>
            <Button
              mt={10}
              size="lg"
              type="submit"
              bg="primary"
              color="white"
              disabled={isSubmitting}
            >
              Update Profile
            </Button>
            <ErrorMessage errors={errors} name="form" />
          </VStack>
        </form>
      </FormProvider>
    </>
  )
}

export default Account
