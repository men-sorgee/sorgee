import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Wrap,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { useMember, useMeta } from 'hooks'
import { formatDistanceToNowStrict } from 'date-fns'
import {
  DirectusField,
  memberProfileFields,
  memberProfileExplicitFields,
  memberInterestsFields,
  memberHealthFields,
  memberProfileContactFields,
  UserPhoto,
} from 'lib/models'
import { ReactNode, useEffect } from 'react'
import { ImageGallery } from './ImageGallery'
import { Loading } from './Loading'
import { MemberHeader } from './MemberHeader'
import { MemberPropertyGroup } from './MemberPropertyGroup'
import { Rating } from './Rating'
import { toLocalDate } from '../../lib/utils'

type Props = {
  id: string
  full?: boolean
  fields?: Record<string, DirectusField>
  children?: ReactNode
}

export const MemberSpotlight = ({ id, fields, full = true, children }: Props) => {
  const { member, name, picture, loading } = useMember(id)
  const { setMeta } = useMeta()
  useEffect(() => {
    if (full) setMeta(name || 'Brother', member?.biography, picture)
  }, [full, member, name, picture, setMeta])
  if (loading || !id || !member) return <Loading />
  const publicPhotos = member.my_photos?.filter((p) => p.is_public) || []
  return (
    <Flex direction="column" justify="space-between">
      <Box
        p={4}
        bgGradient={full ? 'linear(to-bl, primary.300, primary.700)' : null}
        rounded="lg"
        color="white"
      >
        <MemberHeader member={member} zoom={true}>
          {children}
        </MemberHeader>
        {full && <Text>{member?.biography}</Text>}
        {full && (
          <Flex justify="space-between">
            <Text fontSize="xs">
              {member.last_login && (
                <>
                  Last Login: {formatDistanceToNowStrict(toLocalDate(member.last_login))} ago
                  <br />
                </>
              )}
              Member Since: {new Date(member.date_created).toLocaleDateString()}
            </Text>
            {member?.rating > 0 && (
              <Rating
                value={member.rating || 0}
                mt={2}
                aria-label="User Rating"
                size={['xs']}
                simple
              />
            )}
          </Flex>
        )}
      </Box>
      {full && (
        <Box my={4} flex="grow">
          {publicPhotos.length > 0 && (
            <ImageGallery
              images={publicPhotos.map((p: UserPhoto) => `/api/asset/${p.directus_files_id}`)}
            />
          )}
        </Box>
      )}

      {fields && (
        <Tabs
          isFitted
          variant="enclosed"
          colorScheme="primary"
          fontSize={['sm', 'md', 'lg']}
          w="full"
          px={2}
          flex="grow"
        >
          <TabList>
            <Tab>General</Tab>
            <Tab>Sexual</Tab>
            <Tab>Interests</Tab>
            <Tab>Health</Tab>
          </TabList>
          <TabPanels maxH="100%" overflowY="auto" my={2}>
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
      )}
    </Flex>
  )
}
