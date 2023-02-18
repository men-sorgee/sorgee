import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Text, Wrap } from '@chakra-ui/react'
import { useMember, useMeta } from 'hooks'
import {
  DirectusField,
  memberProfileFields,
  memberProfileExplicitFields,
  memberInterestsFields,
  memberHealthFields,
  memberProfileContactFields,
  UserPhoto,
} from 'lib/models'
import { useEffect } from 'react'
import { ImageGallery } from './ImageGallery'
import { Loading } from './Loading'
import { MemberHeader } from './MemberHeader'
import { MemberPropertyGroup } from './MemberPropertyGroup'

type Props = {
  id: string
  fields: Record<string, DirectusField>
}

export const MemberSpotlight = ({ id, fields }: Props) => {
  const { member, name, picture, loading } = useMember(id)
  const { setMeta } = useMeta()
  useEffect(() => {
    setMeta(name || 'Brother', member?.biography, picture)
  }, [member, name, picture, setMeta])
  if (loading || !id || !member) return <Loading />
  const publicPhotos = member.my_photos?.filter((p) => p.is_public) || []
  return (
    <>
      <Box p={4}>
        <MemberHeader member={member} />
        <Text>{member?.biography}</Text>
      </Box>
      <Box>
        <Wrap m={4}>
          {publicPhotos.length > 0 && (
            <ImageGallery
              images={publicPhotos.map((p: UserPhoto) => `/api/asset/${p.directus_files_id}`)}
            />
          )}
        </Wrap>
      </Box>
      <Tabs
        isFitted
        variant="enclosed"
        colorScheme="primary"
        fontSize={['sm', 'md', 'lg']}
        w="full"
        px={2}
      >
        <TabList>
          <Tab>General</Tab>
          <Tab>Sexual</Tab>
          <Tab>Interests</Tab>
          <Tab>Health</Tab>
        </TabList>
        <TabPanels maxH={300} minH={200} overflowY="scroll" my={2}>
          <TabPanel p={4}>
            <MemberPropertyGroup
              k="profile"
              member={member}
              fieldList={memberProfileFields}
              show={member?.show_profile}
              fields={fields}
            />
          </TabPanel>
          <TabPanel>
            <MemberPropertyGroup
              k="explicit"
              member={member}
              fieldList={memberProfileExplicitFields}
              show={member?.show_explicit}
              fields={fields}
              maxCols={2}
            />
          </TabPanel>
          <TabPanel>
            <MemberPropertyGroup
              k="interests"
              member={member}
              fieldList={memberInterestsFields}
              show={member?.show_interests}
              fields={fields}
            />
          </TabPanel>
          <TabPanel>
            <MemberPropertyGroup
              k="health"
              member={member}
              fieldList={memberHealthFields}
              show={member?.show_health}
              fields={fields}
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
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
