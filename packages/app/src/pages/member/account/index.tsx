import {
  ButtonConfirm,
  ButtonLink,
  FieldInput,
  FieldNumber,
  FieldRadioButtons,
  FieldSelect,
  Form,
  Page,
  Plan
} from "components";
import { useFields, useUser } from "hooks";
import { FieldMap, Member, MemberLevel, UserEmailChange } from "lib/models";
import { ApiResult, postJSON } from "lib/utils/apis";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  GridItem,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from "@chakra-ui/react";

export async function getServerSideProps(context) {
  if (context?.params == undefined)
    return {
      redirect: {
        destination: `/member/account/${PageSection[0]}`,
        permanent: false,
      },
    }
  const { section } = context.params

  const props: PageProps = {}
  if (section) {
    props.section = String(section)
  }
  return {
    props,
  }
}

export type PageProps = {
  section?: string
}

enum PageSection {
  info,
  email,
  plan,
  cancel,
}

type SettingsProp = Pick<
  Member,
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'birth_month'
  | 'birth_year'
  | 'email'
  | 'auth_with_phone'
>

type FormProps = PageProps & {
  member: Member
  level: MemberLevel
  mutate: (member: Member) => Promise<ApiResult<Member>>
}

export default function AccountPage({ section }: PageProps) {
  const { fields: fieldMap, loading: fieldsLoading } = useFields('users')
  const { member, loading, level, mutate } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true,
  })
  return (
    <Page title="Account" loading={loading}>
      {member && (
        <AccountForm
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

const AccountForm = ({ fieldMap, section: s = 'info' }: FormProps & { fieldMap: FieldMap }) => {
  const router = useRouter()
  const section = PageSection[s]
  const [tabValue, setTabValue] = useState(section)
  const { member, loading, mutate } = useUser()

  const getOptions = (field: string) => {
    return fieldMap[field]?.meta.options.choices
  }

  const setSection = useCallback(
    (tab: number) => {
      if (tab != tabValue) {
        setTabValue(tab)
        router.push(`/member/account/${PageSection[tab]}`, undefined, { shallow: true })
      }
    },
    [router, tabValue]
  )

  const {
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    birth_month,
    birth_year,
    auth_with_phone,
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
    auth_with_phone,
  }

  const required = { value: true, message: 'Required' }
  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21

  return (
    <Tabs
      isFitted
      fontSize={{ base: 'sm', md: 'lg' }}
      defaultIndex={tabValue}
      onChange={(index) => setSection(index)}
      justifyItems="stretch"
    >
      <TabList>
        <Tab
          fontSize={['md', 'lg', '2xl']}
          fontWeight={tabValue == 0 ? 'bold' : null}
          px={[1, 2, 4]}
        >
          Info
        </Tab>

        <Tab
          fontSize={['md', 'lg', '2xl']}
          fontWeight={tabValue == 1 ? 'bold' : null}
          px={[1, 2, 4]}
        >
          Email
        </Tab>
        <Tab
          fontSize={['md', 'lg', '2xl']}
          fontWeight={tabValue == 2 ? 'bold' : null}
          px={[1, 2, 4]}
        >
          Plan
        </Tab>
        <Tab
          fontSize={['md', 'lg', '2xl']}
          fontWeight={tabValue == 3 ? 'bold' : null}
          px={[1, 2, 4]}
        >
          Cancel
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <Alert px={[4, 4, 6]} gap={2} justifyItems="space-between" rounded="lg" mb={4}>
            <Box>
              <Heading as="h3" fontSize="xl" mt={0}>
                Private Information
              </Heading>
              <Text>
                This information is never shared. It is used to verify your identity and to help us
                provide a better experience for you.
              </Text>
            </Box>
          </Alert>
          <Form
            onSubmit={mutate}
            defaultValues={defaultValues}
            successMessage="Your settings were updated."
          >
            {({ formState: { isSubmitting }, watch }) => {
              const isText = watch('auth_with_phone')
              return (
                <>
                  <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                    <FieldInput
                      field="first_name"
                      label="First Name"
                      registerOptions={{ required }}
                    />
                    <FieldInput field="last_name" label="Last Name" registerOptions={{ required }} />
                    <FieldSelect
                      field="birth_month"
                      label="Birth Month"
                      registerOptions={{ required }}
                      options={getOptions('birth_month')}
                    />
                    <FieldNumber
                      field="birth_year"
                      label="Birth Year"
                      registerOptions={{ required, min: minYear, max: maxYear }}
                    />

                    <GridItem colSpan={[1, 2]}>
                      <FieldRadioButtons
                        field="auth_with_phone"
                        label="Sign-in Link"
                        help="If you are having issues receiving the sign-in link, you can switch it to use your cell number instead."
                        options={[
                          { value: 'false', text: 'Send via Email' },
                          { value: 'true', text: 'Send via SMS' },
                        ]}
                      />
                    </GridItem>
                    {isText && <GridItem colSpan={[1, 2]}>
                      <Text p={2} rounded="lg" bg='bg' shadow="md" fontSize="sm" textStyle='italic' color='text'>
                        By selecting SMS, you agree to receive text messages from us (720-724-9426) for the purpose of accessing this site.
                        We will never send you marketing messages or share your phone number with anyone else.
                      </Text>
                    </GridItem>}
                    <GridItem colSpan={[1, 2]}>
                      <Divider />
                    </GridItem>
                    <GridItem colSpan={[1, 2]}>

                      <Alert px={[4, 4, 6]} gap={2} justifyItems="space-between" rounded="lg" mb={4}>
                        <Box>
                          <Heading as="h3" fontSize="xl" mt={0}>
                            Contact Information
                          </Heading>
                          <Text>
                            The following information may be shared if you choose to share contact data
                            with your buddies.
                          </Text>
                        </Box>
                      </Alert>
                    </GridItem>
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

                  </SimpleGrid>
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
                    bg="primary.500"
                    color="white"
                    disabled={isSubmitting}
                    position="sticky"
                    bottom={4}
                    _hover={{ bg: 'accent.500' }}
                    w={['full', 'auto']}
                  >
                    Update Info
                  </Button>
                </>
              )
            }}
          </Form>
        </TabPanel>

        <TabPanel px={0}>
          <Alert px={[4, 4, 6]} gap={2} justifyItems="space-between" rounded="lg" mb={4}>
            <Box>
              <Heading as="h3" fontSize="xl" mt={0}>
                Change Email Address
              </Heading>
              <Text>
                Changing your email address will require you to verify your new email address. Are
                you sure you want to change your email?
              </Text>
            </Box>
          </Alert>
          <Form
            onSubmit={(data) => postJSON<UserEmailChange, boolean>('/api/my/email/change', data)}
            defaultValues={{
              email: member?.email,
              email_new: member?.email_new,
            }}
            successMessage="We sent your new email address a verification link. Once you click the link in the email, your email address will change."
          >
            {({ formState: { isSubmitting } }) => (
              <>
                <SimpleGrid spacing={4} columns={{ base: 1, md: 2 }}>
                  <FieldInput
                    type="email"
                    field="email"
                    label="Old Email"
                    placeholder="Email"
                    w="full"
                    readOnly={true}
                  />
                  <FieldInput
                    type="email"
                    field="email_new"
                    label="New Email"
                    placeholder="New Email"
                    w="full"
                    registerOptions={{ required }}
                  />
                </SimpleGrid>
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
                  colorScheme="primary"
                  color="white"
                  w={['full', 'auto']}
                  disabled={isSubmitting}
                >
                  Update Email
                </Button>
              </>
            )}
          </Form>
        </TabPanel>
        <TabPanel px={0}>
          <Alert px={[4, 4, 6]} gap={2} justifyItems="space-between" rounded="lg">
            <Box>
              <Heading as="h3" fontSize="xl" mt={0}>
                Plan Subscription
              </Heading>
              <Text>
                Subscriptions enable additional features to enhance your experience on the site. You
                can subscribe to a plan at any time.
              </Text>
            </Box>
          </Alert>{' '}
          {(member && member?.membership_type != 'none' && (
            <Plan plan={member.membership_type} interval={member.renewal_type} />
          )) || (
              <ButtonLink
                href="/member/subscription"
                size="lg"
                mt={4}
                type="submit"
                colorScheme="secondary"
                w={['full', 'auto']}
              >
                Choose a Plan
              </ButtonLink>
            )}
        </TabPanel>
        <TabPanel px={0}>
          <Alert px={[4, 4, 6]} gap={2} justifyItems="start" rounded="lg" mb={10} flexDir="column">
            <Box>
              <Heading as="h3" fontSize="xl" mt={0}>
                Deactivate Account
              </Heading>
              <Text>
                Deactivating your account will remove your profile from the site. You will no longer
                be able to sign in. Your data will be retained for siz months in case you change
                your mind.
              </Text>
              <ButtonConfirm
                size="lg"
                mt={4}
                colorScheme="secondary"
                w={['full', 'full', 'auto']}
                onSuccess={async () => {
                  location.href = '/api/me/close'
                }}
                buttonText="Deactivate Account"
                alertTitle="Deactivate Account"
              >
                <Text>Are you sure you want to deactivate your account?</Text>
              </ButtonConfirm>
            </Box>
          </Alert>
          <Alert px={[4, 4, 6]} gap={2} justifyItems="start" rounded="lg" mb={10} flexDir="column">
            <Box>
              <Heading as="h3" fontSize="xl" mt={0}>
                Deactivate Account & Delete Data
              </Heading>
              <Text>
                Deleting your account will remove all of your data from our servers. This includes
                your profile, messages, and any other information you have provided.
              </Text>
              <ButtonConfirm
                size="lg"
                type="submit"
                colorScheme="red"
                mt={4}
                w={['full', 'full', 'auto']}
                confirmedAction={async () => true}
                onSuccess={async () => {
                  location.href = '/api/me/delete'
                }}
                buttonText="Deactivate Account & Delete Data"
                alertTitle="Permanently Delete Account"
                aria-label="Permanently Delete Account"
              >
                <Text>
                  Are you sure you want to completely delete your account? There is no undoing this.
                  Your data may take up to two days to be completely removed from our servers. You
                  will be immediately signed out and will not be able to sign in again.
                </Text>
              </ButtonConfirm>
            </Box>
          </Alert>
        </TabPanel>
      </TabPanels>
    </Tabs >
  )
}
