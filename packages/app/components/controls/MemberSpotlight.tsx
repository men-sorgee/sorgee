import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Text } from '@chakra-ui/react'
import { useMember } from '../../hooks'
import {
  DirectusField,
  memberProfileFields,
  memberProfileExplicitFields,
  memberInterestsFields,
  memberHealthFields,
  memberProfileContactFields,
} from '../../lib/models'
import { Loading } from './Loading'
import { MemberPropertyGroup } from './MemberPropertyGroup'

type Props = {
  id: string
  fields: Record<string, DirectusField>
}

export const MemberSpotlight = ({ id, fields }: Props) => {
  const { member, loading } = useMember(id)
  if (loading || !id || !member) return <Loading />

  return (
    <Flex direction="column" mb={2} align="start" justify="stretch" gap={2} w="full">
      <Text>{member?.biography}</Text>

      <Tabs isFitted fontSize={{ base: 'sm', md: 'lg' }} w="full">
        <TabList>
          <Tab>General</Tab>
          <Tab>Sexual</Tab>
          <Tab>Interests</Tab>
          {/**<Tab>Location</Tab>**/}
          <Tab>Health</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MemberPropertyGroup
              k="profile"
              member={member}
              fieldList={memberProfileFields}
              show={member?.show_profile}
              fields={fields}
              color="green"
            />
          </TabPanel>
          <TabPanel>
            <MemberPropertyGroup
              k="explicit"
              member={member}
              fieldList={memberProfileExplicitFields}
              show={member?.show_explicit}
              fields={fields}
              color="red"
            />
          </TabPanel>
          <TabPanel>
            <MemberPropertyGroup
              k="interests"
              member={member}
              fieldList={memberInterestsFields}
              show={member?.show_interests}
              fields={fields}
              color="blue"
            />
          </TabPanel>
          {/**<TabPanel>
            <PropertyGroup
              member={member}
              fieldList={memberProfileLocationFields}
              show={member?.show_location}
              fields={fields}
              color="purple"
            />
          </TabPanel>
          {**/}
          <TabPanel>
            <MemberPropertyGroup
              k="health"
              member={member}
              fieldList={memberHealthFields}
              show={member?.show_health}
              fields={fields}
              color="orange"
              maxCols={2}
            />
          </TabPanel>
          <TabPanel>
            <MemberPropertyGroup
              k="contact"
              member={member}
              fieldList={memberProfileContactFields}
              show={member?.show_contact}
              fields={fields}
              color="orange"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}
