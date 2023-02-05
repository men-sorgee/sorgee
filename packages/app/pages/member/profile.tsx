import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FormOptions, User } from 'lib/models'
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
import { UserCard } from 'components/ui'

type PageProps = {
  spectrumOptions: FormOptions
  relationshipOptions: FormOptions
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
  cockGirthOptions: FormOptions
  cockAttributesOptions: FormOptions
  ballSizeOptions: FormOptions
  ballGravityOptions: FormOptions
  cumAttributesOptions: FormOptions
  loadPolicyOptions: FormOptions
  hivStatusOptions: FormOptions
  vaccinationStatusOptions: FormOptions
  myRolesOptions: FormOptions
  theirRolesOptions: FormOptions
  theirSpectrumOptions: FormOptions
  theirPositionsOptions: FormOptions
  buildOptions: FormOptions
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
    formState: { isSubmitting, errors },
  } = methods

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
              <Tab fontWeight={tabValue == 1 ? 'bold' : null}>Interests</Tab>
              <Tab fontWeight={tabValue == 2 ? 'bold' : null} display={['none', 'inherit']}>
                Preferences
              </Tab>
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
                    This is your profile. Other verified members are able to see this information.
                    You can also choose to make your profile private.
                  </Text>
                  <FieldSwitch
                    field="show_profile"
                    label="Show Profile"
                    help="Turn this on, if you are okay showing this information to other verified members."
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
                  <FieldSelect field="spectrum" label="Orientation" formOptions={spectrumOptions} />
                  <FieldSelect
                    field="mannerisms"
                    label="Mannerisms"
                    formOptions={mannerismsOptions}
                  />
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
                />
                <SimpleGrid spacing={2} columns={[2, 2, 4]}>
                  <FieldNumber field="age" label="Age" min={21} />
                  <FieldInput field="height" label="Height" placeholder="5'11" />
                  <FieldNumber field="weight" label="Weight" placeholder="185" />
                  <FieldSelect field="build" label="Build" formOptions={buildOptions} />
                </SimpleGrid>

                <SimpleGrid spacing={2} columns={[1, 3]}>
                  <FieldSelect field="skin_tone" label="Skin Tone" formOptions={skinToneOptions} />
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
                </SimpleGrid>
                <FieldCheckboxes
                  field="body_attributes"
                  label="Other Attributes"
                  formOptions={bodyAttributesOptions}
                />
                <Divider mt={4} mb={2} />
                <SimpleGrid spacing={2} columns={{ base: 1, md: 2 }}>
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
                <SimpleGrid spacing={2} columns={{ base: 1, md: 2 }}>
                  <FieldSelect field="ball_size" label="Ball Size" formOptions={ballSizeOptions} />
                  <FieldSelect
                    field="ball_gravity"
                    label="Ball Sack"
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
                  bg={'primary'}
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
                <SimpleGrid spacing={2}>
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
                  bg={'primary'}
                  color="white"
                  flexDirection="column"
                  my={4}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                >
                  <Text>
                    What are you attracted to and/or compatible with? We will use this information
                    to optimize compatibility for events. Other members will not see this
                    information.
                  </Text>
                </Alert>
                <SimpleGrid spacing={2}>
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
                  bg={'primary'}
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
                <SimpleGrid spacing={2} columns={{ base: 1, md: 2 }}>
                  <FieldSelect
                    field="hiv_status"
                    label="HIV Status"
                    formOptions={hivStatusOptions}
                  />
                  <FieldInput field="last_tested" label="Last Tested" type="date" />
                </SimpleGrid>
                <SimpleGrid spacing={2}>
                  <FieldCheckboxes
                    field="load_policy"
                    label="Safety Policy"
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
          </VStack>
        </form>
      </FormProvider>
    </>
  )
}

export default Account
