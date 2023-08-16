import {
  ButtonLink,
  FieldCheckboxes,
  FieldInput,
  FieldNumber,
  FieldSelect,
  FieldSwitch,
  FieldText,
  Form,
  MemberCard,
  MemberModal,
  Page
} from "components";
import { useFields, useUser } from "hooks";
import { FieldMap, Member, MemberLevel } from "lib/models";
import { ApiResult } from "lib/utils";
import { useCallback, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Collapse,
  Flex,
  GridItem,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";

type PageProps = {
  section?: string
}

export async function getServerSideProps(context) {
  if (context?.params == undefined)
    return {
      redirect: {
        destination: `/member/profile/${PageSection[0]}`,
        permanent: false
      }
    }
  const { section } = context.params

  const props: PageProps = {}
  if (section) {
    props.section = String(section)
  }
  return {
    props
  }
}

export default function ProfilePage({ section }: PageProps) {
  const { fields: fieldMap, loading: fieldsLoading } = useFields('users')
  const { member, loading, level, mutate } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true
  })
  return (
    <Page title="Your Profile" loading={loading || fieldsLoading}>
      {member && (
        <ProfileForm
          member={member}
          level={level}
          mutate={mutate}
          fieldMap={fieldMap}
          section={section}
        />
      )}
    </Page>
  )
}

type ProfileProps = Pick<
  Member,
  | 'show_profile'
  | 'nickname'
  | 'spectrum'
  | 'mannerisms'
  | 'relationship_status'
  | 'biography'
  | 'age'
  | 'height'
  | 'weight'
  | 'build'
  | 'skin_tone'
  | 'hair_color'
  | 'eye_color'
  | 'hair_style'
  | 'body_hair'
  | 'facial_hair'
  | 'body_attributes'
  | 'show_explicit'
  | 'show_explicit_roles'
  | 'show_photos'
  | 'cock_length'
  | 'cock_girth'
  | 'cock_attributes'
  | 'ball_size'
  | 'ball_gravity'
  | 'cum_attributes'
  | 'sexual_scenes'
  | 'my_roles'
  | 'my_positions'
  | 'show_health'
  | 'hiv_status'
  | 'last_tested'
  | 'load_policy'
  | 'vaccinations'
>

enum PageSection {
  basic,
  explicit,
  roles,
  health
}

type FormProps = PageProps & {
  member: Member
  level: MemberLevel
  mutate: (member: Member) => Promise<ApiResult<Member>>
}

const ProfileForm = ({
  member,
  mutate,
  level,
  fieldMap,
  section: s = 'explicit'
}: FormProps & { fieldMap: FieldMap }) => {
  const section = PageSection[s]
  const [tabValue, setTabValue] = useState(section)

  const setSection = useCallback(
    (tab: number) => {
      if (tab != tabValue) {
        setTabValue(tab)
        window.history.pushState(
          {},
          null,
          `/member/profile/${PageSection[tab]}`
        )
      }
    },
    [tabValue]
  )

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
    show_photos,
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
    vaccinations
  } = member

  const defaultValues: ProfileProps = {
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
    show_photos,
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
    vaccinations
  }

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isPledge = level == MemberLevel.pledge
  return (
    <>
      <Text size="lg" mb={4}>
        This is your profile. We use this information to match you with
        brothers. Verified brothers can see your full profile, unless you choose
        to make it private. <b>Click to open your full profile!</b>
      </Text>

      <Collapse animateOpacity in={show_profile}>
        <MemberCard
          member={member}
          viewer={member}
          full
          onClick={onOpen}
          size="xl"
        />
        <MemberModal
          isOpen={isOpen}
          memberId={member?.id}
          onClose={onClose}
          size="xl"
        />
      </Collapse>
      {!show_profile && (
        <Alert
          color="white"
          flexDirection="column"
          my={4}
          p={4}
          borderRadius="md"
          shadow="md"
          bg="orange.500"
        >
          You are not currently showing your profile. You can change this in the
          Basic section.
        </Alert>
      )}
      {isPledge && (
        <Alert
          color="white"
          flexDirection="column"
          my={4}
          p={4}
          borderRadius="md"
          shadow="md"
          bg="orange.500"
        >
          As a Pledge you are hoping someone sees enough of you in your profile
          that they choose to reach out and vet you for the group. Vague, short
          profiles are not likely to get you very far. Photos help!
        </Alert>
      )}
      <Form
        onSubmit={mutate}
        defaultValues={defaultValues}
        successMessage="Your profile was updated."
      >
        {({ watch, formState: { isDirty, isSubmitting } }) => (
          <>
            <Tabs
              isFitted
              defaultIndex={tabValue}
              onChange={(index) => setSection(index)}
              mt={4}
              size={['sm', 'lg']}
            >
              <TabList fontWeight="bold">
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 0 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Basic
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 1 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Explicit
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 2 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Roles
                </Tab>
                <Tab
                  fontSize={['md', 'lg', '2xl']}
                  fontWeight={tabValue == 3 ? 'bold' : null}
                  px={[1, 2, 4]}
                >
                  Health
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={watch('show_profile') ? 0 : 4}>
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
                      mb={4}
                      field="show_profile"
                      label="Show Profile in Search"
                      help="Turn this off, if do not wish to be searchable on the members page. This does not affect this information being used to
                        recommend you to other events and members."
                    />
                    <Flex flexDirection={'row'} gap={4} mt={4} w="full">
                      {watch('show_profile') && (
                        <FieldSwitch
                          mt={4}
                          field="show_photos"
                          label="Show Photos on Profile"
                          help="Turn this off, if do not wish to be searchable on the members page."
                        />
                      )}
                      {watch('show_profile') && watch('show_photos') && (
                        <ButtonLink
                          href="/member/photos"
                          size="sm"
                          variant="outline"
                        >
                          Manage Photos
                        </ButtonLink>
                      )}
                    </Flex>
                  </Alert>
                  <SimpleGrid spacing={4} columns={[1, 1, 3]}>
                    <GridItem colSpan={[1, 1, 3]}>
                      <FieldInput
                        field="nickname"
                        label="Nickname"
                        help="This is the name that will be displayed on your profile."
                        className="col-span-2 sm:col-span-4"
                      />
                    </GridItem>
                    <FieldSelect
                      field="spectrum"
                      label="Orientation"
                      options={getOptions('spectrum')}
                    />
                    <FieldSelect
                      field="mannerisms"
                      label="Mannerisms"
                      options={getOptions('mannerisms')}
                    />
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

                  <SimpleGrid mt={4} spacing={4} columns={[2, 2, 4]}>
                    <FieldNumber field="age" label="Age" min={21} />
                    <FieldInput
                      field="height"
                      label="Height"
                      placeholder="5'11"
                    />
                    <FieldNumber
                      field="weight"
                      label="Weight"
                      placeholder="185"
                    />
                    <FieldSelect
                      field="build"
                      label="Build"
                      options={getOptions('build')}
                    />
                    <FieldSelect
                      field="skin_tone"
                      label="Skin Tone"
                      options={getOptions('skin_tone')}
                    />
                    <FieldSelect
                      field="hair_color"
                      label="Hair Color"
                      options={getOptions('hair_color')}
                    />
                    <FieldSelect
                      field="hair_style"
                      label="Hair Style"
                      options={getOptions('hair_style')}
                    />
                    <FieldSelect
                      field="body_hair"
                      label="Body Hair"
                      options={getOptions('body_hair')}
                    />
                    <GridItem colSpan={[1, 1, 2]}>
                      <FieldSelect
                        field="facial_hair"
                        label="Facial Hair"
                        options={getOptions('facial_hair')}
                      />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 2]}>
                      <FieldSelect
                        field="eye_color"
                        label="Eye Color"
                        options={getOptions('eye_color')}
                      />
                    </GridItem>
                    <GridItem colSpan={[2, 2, 4]}>
                      <FieldCheckboxes
                        field="body_attributes"
                        label="Other Attributes"
                        options={getOptions('body_attributes')}
                      />
                    </GridItem>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel p={0} pt={watch('show_profile') ? 0 : 4}>
                  <Collapse animateOpacity in={watch('show_profile')}>
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
                        mt={4}
                        field="show_explicit"
                        label="Show Explicit Details on Profile"
                        help="Turn this off, if would rather not show this information to other verified members."
                      />
                    </Alert>
                  </Collapse>
                  <SimpleGrid spacing={4} columns={[2]}>
                    <FieldInput
                      field="cock_length"
                      label="Cock Length"
                      type="number"
                      step=".5"
                    />
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

                <TabPanel p={0} pt={watch('show_profile') ? 0 : 4}>
                  <Collapse animateOpacity in={watch('show_profile')}>
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
                        mt={4}
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

                <TabPanel p={0} pt={watch('show_profile') ? 0 : 4}>
                  <Collapse animateOpacity in={watch('show_profile')}>
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
                        mt={4}
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
                    <FieldInput
                      field="last_tested"
                      label="Last Tested"
                      type="date"
                    />
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
              position="sticky"
              bottom={4}
              disabled={isSubmitting || !isDirty}
              _hover={{ bg: 'accent.500' }}
              w={['full', 'full', 'auto']}
            >
              Update Profile
            </Button>
          </>
        )}
      </Form>
    </>
  )
}
