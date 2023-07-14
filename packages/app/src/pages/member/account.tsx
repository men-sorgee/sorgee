import { Page } from 'components'
import { useUser } from 'hooks'
import { useState } from 'react'
import {
  Alert,
  AlertIcon,
  Text,
  Button,
  Flex,
  Input,
  VStack,
  Heading,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react'

import { Plan, ButtonLink } from 'components'
import { WarningIcon } from '@chakra-ui/icons'

type Params = {}

const AccountPage = ({}: Params) => {
  const { member, loading } = useUser()
  const [tabValue, setTabValue] = useState(0)
  return (
    <Page loading={loading} title="Account" requireAuth>
      <Tabs
        isFitted
        fontSize={{ base: 'sm', md: 'lg' }}
        defaultIndex={tabValue}
        onChange={(index) => setTabValue(index)}
      >
        <TabList>
          <Tab
            fontSize={['md', 'lg', '2xl']}
            fontWeight={tabValue == 0 ? 'bold' : null}
          >
            Subscription
          </Tab>
          <Tab
            fontSize={['md', 'lg', '2xl']}
            fontWeight={tabValue == 1 ? 'bold' : null}
          >
            Email
          </Tab>
          <Tab
            fontSize={['md', 'lg', '2xl']}
            fontWeight={tabValue == 2 ? 'bold' : null}
          >
            Account
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            {' '}
            {(member && member?.membership_type != 'none' && (
              <>
                <Plan
                  plan={member?.membership_type}
                  interval={member?.renewal_type}
                />
              </>
            )) || (
              <ButtonLink
                href="/member/subscription"
                size="lg"
                type="submit"
                bg="secondary.500"
                color="white"
                bottom={4}
                _hover={{ bg: 'accent.500' }}
              >
                Subscribe to a Plan
              </ButtonLink>
            )}
          </TabPanel>
          <TabPanel px={0}>
            <Alert
              bg="transparent"
              shadow={'dark-lg'}
              border={'3px solid'}
              borderColor={'accent.500'}
              px={[4, 4, 6]}
              gap={2}
              justifyItems="space-between"
              rounded="lg"
            >
              <VStack>
                <Heading as="h2" fontSize="4xl" mt={0}>
                  Change Email Address
                </Heading>
                <Text>
                  Changing your email address will require you to verify your
                  new email address. Are you sure you want to change your email?
                </Text>
                <Flex
                  direction={['column', 'row']}
                  my={8}
                  gap={[2, 2, 4, 6]}
                  justify="stretch"
                  align="stretch"
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    value={member?.email}
                    w="full"
                  />
                  <Button
                    position="inherit"
                    size="lg"
                    type="submit"
                    bg="secondary.500"
                    color="white"
                    bottom={4}
                    _hover={{ bg: 'accent.500' }}
                  >
                    Update Email
                  </Button>
                </Flex>
              </VStack>
            </Alert>
          </TabPanel>
          <TabPanel px={0}>
            <Alert
              bg="transparent"
              shadow={'dark-lg'}
              border={'3px solid'}
              borderColor={'accent.500'}
              px={[4, 4, 6]}
              gap={2}
              justifyItems="space-between"
              rounded="lg"
            >
              <VStack>
                <Heading as="h2" fontSize="4xl" mt={0}>
                  Delete Account
                </Heading>
                <Text>
                  Deleting your account will remove all of your data from our
                  servers. This includes your profile, messages, and any other
                  information you have provided. Are you sure you want to delete
                  your account?
                </Text>
                <Button
                  size="lg"
                  type="submit"
                  bg="red.500"
                  color="white"
                  bottom={4}
                  my={8}
                  _hover={{ bg: 'red.500' }}
                >
                  Delete Account
                </Button>
              </VStack>
            </Alert>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  )
}

export default AccountPage
