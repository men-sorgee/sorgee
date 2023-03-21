import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { DirectusFile, FieldMap, Member, User } from 'lib/models'
import { useUser } from '@/hooks/use-user'
import { useState, useEffect } from 'react'

import {
  FieldInput,
  FieldSelect,
  FieldNumber,
  FieldText,
  FieldCheckboxes,
  FieldSwitch,
  FieldImage,
} from 'components/forms'
import {
  Alert,
  Button,
  Box,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  SimpleGrid,
  GridItem,
  useColorModeValue,
  Collapse,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useToast } from '@chakra-ui/react'
import { postJSON } from 'lib/utils'
import { MemberHeader } from 'components/controls'
import { useWarnIfUnsavedChanges } from 'hooks/use-warn-if-unsaved'

type PageProps = {
  fieldMap: FieldMap
}

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')
  return {
    props: {
      fieldMap,
    },
  }
}

export default function ProfilePage(props: PageProps) {
  const { member, loading, reload } = useUser()
  return (
    <Page title={`Profile`} loading={loading} requireAuth={true}>
      {member && <Form {...props} />}
    </Page>
  )
}

type MemberFormData = Partial<Member>
function Form(props: PageProps) {
  const toast = useToast()
  const { member, mutate } = useUser()
  const { fieldMap } = props
  const [tabValue, setTabValue] = useState(0)

  const {
    show_profile,
    nickname,
    spectrum,
    mannerisms,
    relationship_status,
    biography,
    age,
    height,
    weight,
    build,
    skin_tone,
    hair_color,
    eye_color,
    hair_style,
    body_hair,
    facial_hair,
    body_attributes,
    show_explicit,
    show_explicit_roles,
    cock_length,
    cock_girth,
    cock_attributes,
    ball_size,
    ball_gravity,
    cum_attributes,
    sexual_scenes,
    my_roles,
    my_positions,
    show_health,
    hiv_status,
    last_tested,
    load_policy,
    vaccinations,
  } = member

  const methods = useForm<MemberFormData>({
    mode: 'onBlur',
    defaultValues: {
      show_profile,
      nickname,
      spectrum,
      mannerisms,
      relationship_status,
      biography,
      age,
      height,
      weight,
      build,
      skin_tone,
      hair_color,
      eye_color,
      hair_style,
      body_hair,
      facial_hair,
      body_attributes,
      show_explicit,
      show_explicit_roles,
      cock_length,
      cock_girth,
      cock_attributes,
      ball_size,
      ball_gravity,
      cum_attributes,
      sexual_scenes,
      my_roles,
      my_positions,
      show_health,
      hiv_status,
      last_tested,
      load_policy,
      vaccinations,
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

  async function onSubmit(data: MemberFormData) {
    const [r, error] = await mutate(data)
    const ok = r && !error

    if (ok) {
      toast({
        title: 'Success',
        description: 'Your profile was updated.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        onCloseComplete: () => {
          reset(r)
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

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }

  const showProfile = watch('show_profile')
  const bg = useColorModeValue('gray.100', 'dark.700')
  return (
    <>
      <FormProvider {...methods}>
        <Text size="lg">
          This is your profile. We use this information to match you with brothers. Verified
          brothers can see your full profile, unless you choose to make it private.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid
            bg={bg}
            columns={{ base: 1, lg: 2 }}
            my={4}
            rounded="lg"
            shadow="lg"
            border="1px solid transparent"
            borderColor={showProfile ? 'accent.500' : 'text'}
          >
            <Collapse animateOpacity in={showProfile}>
              <Flex direction="column" alignContent="center" p={4}>
                <MemberHeader member={member} />

                {member && (
                  <Text noOfLines={2} py={0} my={0}>
                    {member?.biography}
                  </Text>
                )}
              </Flex>
            </Collapse>
            <GridItem colSpan={showProfile ? 1 : 2}>
              <Flex
                flexDirection="column"
                p={4}
                flexShrink={1}
                borderLeft={{ base: 'none', lg: showProfile ? '4px dotted black' : '' }}
                borderTop={{ base: showProfile ? '4px dotted black' : '', lg: 'none' }}
              >
                <Text>
                  You can choose to make your profile private if you do not wish to show up in
                  member searches.*
                </Text>
                <FieldSwitch
                  field="show_profile"
                  label="Show Profile in Search"
                  help="Turn this off, if do not wish to be searchable on the members page."
                />
              </Flex>
            </GridItem>
          </SimpleGrid>
          <Text fontSize="xs" as="em" mb={4}>
            * This does not affect this information being used to recommend you to other events and
            members.
          </Text>

          <SimpleGrid spacing={4} columns={[1, 1, 3]} mt={10}>
            <GridItem colSpan={[1, 1, 3]}>
              <FieldInput
                field="nickname"
                label="Nickname"
                help="This is the name that will be displayed on your profile."
                className="col-span-2 sm:col-span-4"
              />
            </GridItem>
            <FieldSelect field="spectrum" label="Orientation" options={getOptions('spectrum')} />
            <FieldSelect field="mannerisms" label="Mannerisms" options={getOptions('mannerisms')} />
            <FieldSelect
              field="relationship_status"
              label="Relationship Status"
              options={getOptions('relationship_status')}
            />
            <GridItem colSpan={[1, 1, 3]}>
              <FieldText
                field="biography"
                label="Biography"
                help="Tell us about yourself. What are your interests? What are you looking for?"
                rows={4}
              />
            </GridItem>
          </SimpleGrid>

          <SimpleGrid spacing={4} columns={[2, 2, 4]}>
            <FieldNumber field="age" label="Age" min={21} />
            <FieldInput field="height" label="Height" placeholder="5'11" />
            <FieldNumber field="weight" label="Weight" placeholder="185" />
            <FieldSelect field="build" label="Build" options={getOptions('build')} />
            <FieldSelect field="skin_tone" label="Skin Tone" options={getOptions('skin_tone')} />
            <FieldSelect field="hair_color" label="Hair Color" options={getOptions('hair_color')} />
            <FieldSelect field="hair_style" label="Hair Style" options={getOptions('hair_style')} />
            <FieldSelect field="body_hair" label="Body Hair" options={getOptions('body_hair')} />
            <GridItem colSpan={[1, 1, 2]}>
              <FieldSelect
                field="facial_hair"
                label="Facial Hair"
                options={getOptions('facial_hair')}
              />
            </GridItem>
            <GridItem colSpan={[1, 1, 2]}>
              <FieldSelect field="eye_color" label="Eye Color" options={getOptions('eye_color')} />
            </GridItem>
            <GridItem colSpan={[2, 2, 4]}>
              <FieldCheckboxes
                field="body_attributes"
                label="Other Attributes"
                options={getOptions('body_attributes')}
              />
            </GridItem>
          </SimpleGrid>

          <Tabs
            isFitted
            defaultIndex={tabValue}
            onChange={(index) => setTabValue(index)}
            mt={4}
            size={['sm', 'lg']}
          >
            <TabList fontWeight="bold">
              <Tab fontSize={['md', 'lg', '2xl']} fontWeight={tabValue == 0 ? 'bold' : null}>
                Below the Belt
              </Tab>
              <Tab fontSize={['md', 'lg', '2xl']} fontWeight={tabValue == 1 ? 'bold' : null}>
                Role & Fetishes
              </Tab>
              <Tab fontSize={['md', 'lg', '2xl']} fontWeight={tabValue == 2 ? 'bold' : null}>
                Health Info
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0} pt={showProfile ? 0 : 4}>
                <Collapse animateOpacity in={showProfile}>
                  <Alert
                    bg={'primary.300'}
                    color="white"
                    flexDirection="column"
                    my={4}
                    p={4}
                    borderRadius="md"
                    shadow="md"
                  >
                    <FieldSwitch
                      field="show_explicit"
                      label="Show Explicit Details on Profile"
                      help="Turn this off, if would rather not show this information to other verified members."
                    />
                  </Alert>
                </Collapse>
                <SimpleGrid spacing={4} columns={[2]}>
                  <FieldInput field="cock_length" label="Cock Length" type="number" />
                  <FieldSelect
                    field="cock_girth"
                    label="Cock Girth"
                    options={getOptions('cock_girth')}
                  />

                  <FieldSelect
                    field="ball_size"
                    label="Ball Size"
                    options={getOptions('ball_size')}
                  />
                  <FieldSelect
                    field="ball_gravity"
                    label="Ball Sack"
                    options={getOptions('ball_gravity')}
                  />
                </SimpleGrid>
                <SimpleGrid mt={4} spacing={4} columns={1}>
                  <FieldCheckboxes
                    field="cock_attributes"
                    label="Cock Attributes"
                    options={getOptions('cock_attributes')}
                  />
                  <FieldCheckboxes
                    field="cum_attributes"
                    label="Cum Attributes"
                    options={getOptions('cum_attributes')}
                  />
                </SimpleGrid>
              </TabPanel>

              <TabPanel p={0} pt={showProfile ? 0 : 4}>
                <Collapse animateOpacity in={showProfile}>
                  <Alert
                    bg={'primary.300'}
                    color="white"
                    flexDirection="column"
                    my={4}
                    p={4}
                    borderRadius="md"
                    shadow="md"
                  >
                    <FieldSwitch
                      field="show_explicit_roles"
                      mx="auto"
                      label="Show Explicit Roles on Profile"
                      help="Turn this off, if would rather not show this information to other verified members."
                    />
                  </Alert>
                </Collapse>
                <SimpleGrid spacing={4} columns={1}>
                  <FieldCheckboxes
                    field="my_positions"
                    label="My Sexual Positions"
                    options={getOptions('my_positions')}
                  />
                  <FieldCheckboxes
                    field="my_roles"
                    label="My Sexual Roles"
                    options={getOptions('my_roles')}
                  />
                  <FieldCheckboxes
                    field="sexual_scenes"
                    label="Sexual Scenes"
                    options={getOptions('sexual_scenes')}
                  />
                </SimpleGrid>
              </TabPanel>

              <TabPanel p={0} pt={showProfile ? 0 : 4}>
                <Collapse animateOpacity in={showProfile}>
                  <Alert
                    bg={'primary.300'}
                    color="white"
                    flexDirection="column"
                    my={4}
                    p={4}
                    borderRadius="md"
                    shadow="md"
                  >
                    <FieldSwitch
                      field="show_health"
                      label="Show Health Information on Profile"
                      help="Turn this off, if you'd prefer to not display this information to other verified members."
                    />
                  </Alert>
                </Collapse>
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldSelect
                    field="hiv_status"
                    label="HIV Status"
                    options={getOptions('hiv_status')}
                  />
                  <FieldInput field="last_tested" label="Last Tested" type="date" />
                </SimpleGrid>
                <SimpleGrid mt={4} spacing={4} columns={1}>
                  <FieldCheckboxes
                    field="load_policy"
                    label="Safety Policy"
                    options={getOptions('load_policy')}
                  />
                  <FieldCheckboxes
                    field="vaccinations"
                    label="Vax Status"
                    options={getOptions('vaccinations')}
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
            Update Profile
          </Button>
        </form>
      </FormProvider>
    </>
  )
}
