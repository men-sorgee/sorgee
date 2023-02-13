import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldOptions, User } from 'lib/models'
import { useMember } from 'hooks/use-member'
import { useEffect, useState } from 'react'
import {
  FieldInput,
  FieldSelect,
  FieldNumber,
  FieldText,
  FieldCheckboxes,
  FieldSwitch,
} from 'components/forms'
import {
  Alert,
  Button,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  SimpleGrid,
  GridItem,
  VStack,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import { postJSON } from 'lib/utils'
import { UserCard } from 'components/controls'
import { useWarnIfUnsavedChanges } from '../../hooks/use-warn-if-unsaved'

type PageProps = {
  spectrumOptions: FieldOptions
  relationshipOptions: FieldOptions
  positionsOptions: FieldOptions
  skinToneOptions: FieldOptions
  hairColorOptions: FieldOptions
  hairStyleOptions: FieldOptions
  eyeColorOptions: FieldOptions
  mannerismsOptions: FieldOptions
  bodyHairOptions: FieldOptions
  bodyAttributesOptions: FieldOptions
  facialHairOptions: FieldOptions
  scenesOptions: FieldOptions
  cockGirthOptions: FieldOptions
  cockAttributesOptions: FieldOptions
  ballSizeOptions: FieldOptions
  ballGravityOptions: FieldOptions
  cumAttributesOptions: FieldOptions
  loadPolicyOptions: FieldOptions
  hivStatusOptions: FieldOptions
  vaccinationStatusOptions: FieldOptions
  myRolesOptions: FieldOptions
  theirRolesOptions: FieldOptions
  theirSpectrumOptions: FieldOptions
  theirPositionsOptions: FieldOptions
  buildOptions: FieldOptions
}

export async function getServerSideProps(context: NextPageContext) {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const props: PageProps = {
    spectrumOptions: await getFieldOptions<User>('spectrum'),
    relationshipOptions: await getFieldOptions<User>('relationship_status'),
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
    cockGirthOptions: await getFieldOptions<User>('cock_girth'),
    cockAttributesOptions: await getFieldOptions<User>('cock_attributes'),
    ballSizeOptions: await getFieldOptions<User>('ball_size'),
    ballGravityOptions: await getFieldOptions<User>('ball_gravity'),
    cumAttributesOptions: await getFieldOptions<User>('cum_attributes'),
    loadPolicyOptions: await getFieldOptions<User>('load_policy'),
    hivStatusOptions: await getFieldOptions<User>('hiv_status'),
    vaccinationStatusOptions: await getFieldOptions<User>('vaccinations'),
    myRolesOptions: await getFieldOptions<User>('my_roles'),
    theirRolesOptions: await getFieldOptions<User>('their_roles'),
    theirSpectrumOptions: await getFieldOptions<User>('their_spectrum'),
    theirPositionsOptions: await getFieldOptions<User>('their_positions'),
    buildOptions: await getFieldOptions<User>('build'),
  }
  return { props }
}

type MemberFormData = Partial<User>

function Account(props: PageProps) {
  const { member, loading } = useMember()
  return (
    <Page
      title="Edit Profile"
      loading={loading}
      requireAuth={true}
      header={<UserCard user={member} />}
    >
      {member && <Form {...props} />}
    </Page>
  )
}

function Form(props: PageProps) {
  const toast = useToast()
  const { member, reload } = useMember()
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
    scenesOptions,
    cockGirthOptions,
    cockAttributesOptions,
    ballSizeOptions,
    ballGravityOptions,
    cumAttributesOptions,
    loadPolicyOptions,
    hivStatusOptions,
    vaccinationStatusOptions,
    myRolesOptions,
    theirRolesOptions,
    theirSpectrumOptions,
    theirPositionsOptions,
    buildOptions,
  } = props
  const [tabValue, setTabValue] = useState(0)

  const methods = useForm<MemberFormData>({
    mode: 'onBlur',
    defaultValues: {
      ...member,
    },
  })
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods

  useWarnIfUnsavedChanges(isDirty, () => {
    return window.confirm('Are you sure you want to leave? You have unsaved changes.')
  })

  async function onSubmit(data: MemberFormData) {
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
      reset()
    } else if (response.error?.field) {
      // @ts-ignore
      setError(response.error!.field, response.error.message)
    } else {
      setError('form' as any, { message: 'Something went wrong' })
    }
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs isFitted defaultIndex={tabValue} onChange={(index) => setTabValue(index)}>
            <TabList fontSize={['sm', 'md', 'lg']} fontWeight="bold">
              <Tab fontWeight={tabValue == 0 ? 'bold' : null}>General</Tab>
              <Tab fontWeight={tabValue == 1 ? 'bold' : null}>Me</Tab>
              <Tab fontWeight={tabValue == 2 ? 'bold' : null}>Them </Tab>
              <Tab fontWeight={tabValue == 3 ? 'bold' : null}>Health</Tab>
            </TabList>
            <TabPanels>
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
                    This is your profile. We use this information to match you with brothers. By
                    default, they are able to see this information. You can choose to make your
                    profile private if you do not wish to show up in member searches. This does not
                    affect this information being used to recommend you to other events and members.
                  </Text>
                  <FieldSwitch
                    field="show_profile"
                    label="Show Profile"
                    help="Turn this off, if do not wish to be searchable on the members page."
                  />
                </Alert>
                <SimpleGrid spacing={2} columns={[1, 1, 3]}>
                  <GridItem colSpan={[1, 1, 3]}>
                    <FieldInput
                      field="nickname"
                      label="Username"
                      help="This is the name that will be displayed on your profile."
                      className="col-span-2 sm:col-span-4"
                    />
                  </GridItem>
                  <FieldSelect field="spectrum" label="Orientation" options={spectrumOptions} />
                  <FieldSelect field="mannerisms" label="Mannerisms" options={mannerismsOptions} />
                  <FieldSelect
                    field="relationship_status"
                    label="Relationship Status"
                    options={relationshipOptions}
                  />
                </SimpleGrid>
                <FieldText
                  field="biography"
                  label="Biography"
                  help="Tell us about yourself. What are your interests? What are you looking for?"
                  rows={4}
                />
                <SimpleGrid spacing={2} columns={[2, 2, 4]}>
                  <FieldNumber field="age" label="Age" min={21} />
                  <FieldInput field="height" label="Height" placeholder="5'11" />
                  <FieldNumber field="weight" label="Weight" placeholder="185" />
                  <FieldSelect field="build" label="Build" options={buildOptions} />
                </SimpleGrid>

                <SimpleGrid spacing={2} columns={[1, 3]}>
                  <FieldSelect field="skin_tone" label="Skin Tone" options={skinToneOptions} />
                  <FieldSelect field="hair_color" label="Hair Color" options={hairColorOptions} />
                  <FieldSelect field="hair_style" label="Hair Style" options={hairStyleOptions} />
                  <FieldSelect field="body_hair" label="Body Hair" options={bodyHairOptions} />
                  <FieldSelect
                    field="facial_hair"
                    label="Facial Hair"
                    options={facialHairOptions}
                  />
                  <FieldSelect field="eye_color" label="Eye Color" options={eyeColorOptions} />
                </SimpleGrid>
                <FieldCheckboxes
                  field="body_attributes"
                  label="Other Attributes"
                  options={bodyAttributesOptions}
                />
                <Divider mt={4} mb={2} />
              </TabPanel>

              <TabPanel p={0}>
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
                    Your sexual preferences and explicit stats help match you with other members. If
                    you choose to display this info, other members can find you based on these
                    attributes.
                  </Text>
                  <FieldSwitch
                    field="show_explicit"
                    label="Show Explicit Details "
                    help="Turn this on, if you are okay showing this information to other verified members."
                  />
                </Alert>
                <SimpleGrid spacing={2} columns={{ base: 1, md: 2 }}>
                  <FieldInput
                    field="cock_length"
                    label="Cock Length"
                    type="number"
                    registerOptions={{}}
                  />
                  <FieldSelect field="cock_girth" label="Cock Girth" options={cockGirthOptions} />
                  <FieldCheckboxes
                    field="cock_attributes"
                    label="Cock Attributes"
                    className="sm:col-span-2"
                    options={cockAttributesOptions}
                  />
                  <FieldSelect field="ball_size" label="Ball Size" options={ballSizeOptions} />
                  <FieldSelect
                    field="ball_gravity"
                    label="Ball Sack"
                    options={ballGravityOptions}
                  />
                </SimpleGrid>
                <FieldCheckboxes
                  field="cum_attributes"
                  label="Cum Attributes"
                  className="sm:col-span-2"
                  options={cumAttributesOptions}
                />
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
                    Your sexual preferences help us match you with other members that are into the
                    same things.
                  </Text>
                </Alert>

                <FieldCheckboxes
                  field="my_positions"
                  label="My Sexual Positions"
                  options={positionsOptions}
                />
                <FieldCheckboxes
                  field="my_roles"
                  label="My Sexual Roles"
                  options={myRolesOptions}
                />
                <FieldCheckboxes
                  field="sexual_scenes"
                  label="Sexual Scenes"
                  options={scenesOptions}
                />
              </TabPanel>
              <TabPanel p={0}>
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
                    field="show_interests"
                    label="Show Interests "
                    help="Turn this off, if you'd prefer to not display this information to other verified members."
                  />
                </Alert>
                <SimpleGrid spacing={2}>
                  <FieldCheckboxes
                    field="their_spectrum"
                    label="Their Orientation"
                    options={theirSpectrumOptions}
                  />
                  <FieldCheckboxes
                    field="their_relationship_status"
                    label="Their Relationship Status"
                    options={relationshipOptions}
                  />

                  <FieldCheckboxes
                    field="their_positions"
                    label="Their Sexual Positions"
                    options={theirPositionsOptions}
                  />

                  <FieldCheckboxes
                    field="their_roles"
                    label="Their Sexual Roles"
                    options={theirRolesOptions}
                  />
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
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
                    This is your health information. Other members are able to see this information
                    if you choose to show it.
                  </Text>
                  <FieldSwitch
                    field="show_health"
                    label="Show Health Information"
                    help="Turn this off, if you'd prefer to not display this information to other verified members."
                  />
                </Alert>
                <SimpleGrid spacing={2} columns={{ base: 1, md: 2 }}>
                  <FieldSelect field="hiv_status" label="HIV Status" options={hivStatusOptions} />
                  <FieldInput field="last_tested" label="Last Tested" type="date" />
                </SimpleGrid>
                <SimpleGrid spacing={2}>
                  <FieldCheckboxes
                    field="load_policy"
                    label="Safety Policy"
                    options={loadPolicyOptions}
                  />
                  <FieldCheckboxes
                    field="vaccinations"
                    label="Vax Status"
                    options={vaccinationStatusOptions}
                  />
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <input type="hidden" {...register('id')} />

          <Button
            mt={10}
            size="lg"
            type="submit"
            bg="primary"
            color="white"
            disabled={isSubmitting || !isDirty}
          >
            Update Profile
          </Button>
        </form>
      </FormProvider>
    </>
  )
}

export default Account
