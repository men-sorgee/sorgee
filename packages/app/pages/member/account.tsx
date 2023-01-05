import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { Applicant, FormOptions, User } from 'lib/models'
import { getFieldOptions } from '@/lib/services/directus/server'
import { useMember } from 'hooks/use-member'
import { useEffect, useState } from 'react'
import { FieldInput, FieldSelect, FieldWrapper, FieldText, FieldCheckboxes } from 'components/forms'
import {
  Alert,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Toast,
  Stack,
  HStack,
  Show,
  Text,
  Heading,
  SimpleGrid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { LightBulbIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import FieldSwitch from 'components/forms/FieldSwitch'
import { useToast } from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import { postJSON } from '../../lib/utils'

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
  }
  return { props }
}

type MemberFormData = Applicant & {
  height_feet: string
  height_inches: string
}

function Account(props: PageProps) {
  const { loading } = useMember()
  return (
    <Page title="Account" loading={loading} requireAuth={true}>
      <Form {...props} />
    </Page>
  )
}

function Form(props: PageProps) {
  const toast = useToast()
  const { member, reload } = useMember()
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
  } = props
  const [tabValue, setTabValue] = useState(Number(router.query.t) || 0)

  const methods = useForm<MemberFormData>({
    mode: 'onBlur',
    defaultValues: {
      ...member,
      height_feet: member?.height?.toString().substring(0, 1),
      height_inches: member?.height?.toString().substring(2),
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
    return () => {}
  }, [tabValue])

  async function onSubmit(data: MemberFormData) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet}' ${data.height_inches}"`
    }

    const [ok, response] = await postJSON<User>('/api/member/me', data)

    if (ok) {
      reload()
      toast({
        title: 'Success',
        description: 'Your account and profile are updated.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
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
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <Tabs defaultIndex={tabValue} onChange={(index) => setTabValue(index)}>
            <TabList fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
              <Tab>Private</Tab>
              <Tab>Profile</Tab>
              <Tab>Events</Tab>
              <Tab>Interests</Tab>
              <Tab>Health</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
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
                    help="Must be SMS-enabled. Used for optional verification or optional event reminders. Format: 123 456 7890"
                    registerOptions={{
                      pattern: {
                        value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                        message: 'US numbers only. Format: 123 456 7890',
                      },
                    }}
                    placeholder="000 456 7890"
                  />
                </SimpleGrid>

                <Alert
                  as={Stack}
                  direction="row"
                  color="information"
                  alignItems={'start'}
                  my={4}
                  borderRadius={'lg'}
                  spacing={4}
                >
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
                <FieldInput
                  field="nickname"
                  label="Nickname"
                  className="col-span-2 sm:col-span-4"
                  registerOptions={{ required }}
                />
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldSelect
                    field="spectrum"
                    label="Orientation"
                    className="col-span-2"
                    registerOptions={{ required }}
                    formOptions={spectrumOptions}
                  />
                  <FieldSelect
                    field="relationship_status"
                    label="Relationship Status"
                    className="col-span-2"
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
                          <InputRightAddon children="'" mr={2} />
                          <Input type="number" id="height_inches" {...register('height_inches')} />
                          <InputRightAddon children={'"'} />
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
                    className="col-span-2"
                    formOptions={hairColorOptions}
                  />
                  <FieldSelect
                    field="hair_style"
                    label="Hair Style"
                    className="col-span-2"
                    formOptions={hairStyleOptions}
                  />
                  <FieldSelect
                    field="body_hair"
                    label="Body Hair"
                    className="col-span-2"
                    formOptions={bodyHairOptions}
                  />
                  <FieldSelect
                    field="facial_hair"
                    label="Facial Hair"
                    className="col-span-2"
                    formOptions={facialHairOptions}
                  />
                  <FieldSelect
                    field="eye_color"
                    label="Eye Color"
                    className="col-span-2"
                    formOptions={eyeColorOptions}
                  />
                  <FieldSelect
                    field="mannerisms"
                    label="Mannerisms"
                    className="col-span-2"
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

                <Alert
                  as={HStack}
                  alignItems={'start'}
                  color="information"
                  mb={4}
                  borderRadius={'lg'}
                  spacing={2}
                >
                  <LightBulbIcon width={'100px'} />

                  <Text>
                    Members who RSVP to events are expected to attend. Members that RSVP to event
                    and do not attend, decrease the likelihood of getting invited again. We
                    understand that things come up, but please be respectful of your brothers and
                    RSVP accurately and let us know if you can&apos;t make it.
                  </Text>
                </Alert>
              </TabPanel>
              <TabPanel p={0}>
                <FieldCheckboxes
                  field="my_positions"
                  label="Sexual Positions"
                  formOptions={positionsOptions}
                />
                <FieldCheckboxes
                  field="sexual_scenes"
                  label="Sexual Scenes"
                  formOptions={scenesOptions}
                />
              </TabPanel>
              <TabPanel p={0}>
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldSelect
                    field="hiv_status"
                    label="HIV Status"
                    formOptions={hivStatusOptions}
                  />
                  <FieldInput field="last_tested" label="Last Tested" type="date" />
                </SimpleGrid>
                <FieldCheckboxes
                  field="load_policy"
                  label="Load Policy"
                  className="sm:col-span-2"
                  formOptions={loadPolicyOptions}
                />
                <FieldCheckboxes
                  field="vaccinations"
                  label="Vax Status"
                  formOptions={vaccinationStatusOptions}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <input type="hidden" {...register('id')} />

          <Stack>
            <Button mt={10} type="submit" colorScheme="primary" disabled={isSubmitting}>
              Update Profile
            </Button>
            <ErrorMessage errors={errors} name="form" />
          </Stack>
        </form>
      </FormProvider>
    </>
  )
}

export default Account
