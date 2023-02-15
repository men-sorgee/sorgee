import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldMap, User } from 'lib/models'
import { useMember } from 'hooks/use-member'
import { useState } from 'react'
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
  Box,
  Card,
  CardBody,
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
import { MemberHeader, UserCard } from 'components/controls'
import { useWarnIfUnsavedChanges } from '../../hooks/use-warn-if-unsaved'

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
  const { member, loading } = useMember()
  return (
    <Page
      title={`Profile`}
      loading={loading}
      requireAuth={true}
      header={<UserCard user={member} size="xl" />}
    >
      {member && <Form {...props} />}
    </Page>
  )
}

type MemberFormData = Partial<User>
function Form(props: PageProps) {
  const toast = useToast()
  const { member } = useMember()
  const { fieldMap } = props
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
    watch,
    formState: { isSubmitting, isDirty },
  } = methods

  useWarnIfUnsavedChanges(isDirty, () => {
    return window.confirm('Are you sure you want to leave? You have unsaved changes.')
  })

  async function onSubmit(data: MemberFormData) {
    const [ok, response] = await postJSON<User>('/api/member/me', data)

    if (ok) {
      reset()
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

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }
  const showProfile = watch('show_profile')
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              You can choose to make your profile private if you do not wish to show up in member
              searches. This does not affect this information being used to recommend you to other
              events and members.
            </Text>
            <FieldSwitch
              field="show_profile"
              label="Show Profile in Search"
              help="Turn this off, if do not wish to be searchable on the members page."
            />
          </Alert>
          <Text size="lg">
            This is your profile. We use this information to match you with brothers. Verified
            brothers can see your full profile, unless you choose to make it private.
          </Text>
          <Collapse animateOpacity in={showProfile}>
            <Card
              w="full"
              h="full"
              bg={useColorModeValue('gray.50', 'dark.700')}
              border="1px solid transparent"
              borderColor="accent.400"
            >
              <CardBody>
                <Flex>
                  <MemberHeader member={member} />
                </Flex>
                {member && <Text>{member?.biography}</Text>}
              </CardBody>
            </Card>
          </Collapse>
          <SimpleGrid spacing={2} columns={[1, 1, 3]}>
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
          </SimpleGrid>
          <FieldText
            field="biography"
            label="Biography"
            help="Tell us about yourself. What are your interests? What are you looking for?"
            rows={4}
          />
          <SimpleGrid spacing={2} columns={[2, 2, 3, 4]}>
            <FieldNumber field="age" label="Age" min={21} />
            <FieldInput field="height" label="Height" placeholder="5'11" />
            <FieldNumber field="weight" label="Weight" placeholder="185" />
            <FieldSelect field="build" label="Build" options={getOptions('build')} />
            <FieldSelect field="skin_tone" label="Skin Tone" options={getOptions('skin_tone')} />
            <FieldSelect field="hair_color" label="Hair Color" options={getOptions('hair_color')} />
            <FieldSelect field="hair_style" label="Hair Style" options={getOptions('hair_style')} />
            <FieldSelect field="body_hair" label="Body Hair" options={getOptions('body_hair')} />
            <FieldSelect
              field="facial_hair"
              label="Facial Hair"
              options={getOptions('facial_hair')}
            />
            <FieldSelect field="eye_color" label="Eye Color" options={getOptions('eye_color')} />
          </SimpleGrid>
          <FieldCheckboxes
            field="body_attributes"
            label="Other Attributes"
            options={getOptions('body_attributes')}
          />
          <Tabs isFitted defaultIndex={tabValue} onChange={(index) => setTabValue(index)} mt={4}>
            <TabList fontWeight="bold">
              <Tab fontSize={['md', 'lg', 'xl']} fontWeight={tabValue == 0 ? 'bold' : null}>
                Below the Belt
              </Tab>
              <Tab fontSize={['md', 'lg', 'xl']} fontWeight={tabValue == 1 ? 'bold' : null}>
                Role & Fetishes
              </Tab>
              <Tab fontSize={['md', 'lg', 'xl']} fontWeight={tabValue == 2 ? 'bold' : null}>
                Health Info
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
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
                <SimpleGrid spacing={2} columns={[2]}>
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
              </TabPanel>

              <TabPanel p={0}>
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
                      mx="auto"
                      label="Show Explicit Details on Profile"
                      help="Turn this off, if would rather not show this information to other verified members."
                    />
                  </Alert>
                </Collapse>

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
              </TabPanel>

              <TabPanel p={0}>
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
                <SimpleGrid spacing={2} columns={{ base: 1, md: 2 }}>
                  <FieldSelect
                    field="hiv_status"
                    label="HIV Status"
                    options={getOptions('hiv_status')}
                  />
                  <FieldInput field="last_tested" label="Last Tested" type="date" />
                </SimpleGrid>
                <SimpleGrid spacing={2}>
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
          <Box backdropFilter="blur(1px)" position="sticky" h="80px" w="full" bottom={0}></Box>
          <Button
            mt={-10}
            size="lg"
            type="submit"
            bg="primary"
            color="white"
            disabled={isSubmitting || !isDirty}
            position="sticky"
            bottom={4}
            mx={2}
          >
            Update Profile
          </Button>
        </form>
      </FormProvider>
    </>
  )
}
