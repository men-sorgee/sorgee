import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Heading,
  Flex,
  ButtonGroup,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  AvatarProps,
  Spacer,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react'
import { MemberConnect, MemberChat, MemberHeader, MemberPropertyGroup } from '.'
import { useMember, useMeta } from 'hooks'
import { formatDistanceToNowStrict } from 'date-fns'
import {
  DirectusField,
  memberProfileFields,
  memberProfileExplicitFields,
  memberInterestsFields,
  memberProfileHealthFields,
  memberProfileContactFields,
  UserPhoto,
  MemberLevel,
  MemberLevelColorMap,
  memberProfileExplicitRolesFields,
  memberEventFields,
} from 'lib/models'
import { ReactNode, useEffect } from 'react'
import { ImageGallery } from './ImageGallery'
import { Loading } from './Loading'
import { Rating } from './Rating'
import { toLocalDate } from 'lib/utils'

type Props = AvatarProps & {
  id: string
  full?: boolean
  color?: string
  fields?: Record<string, DirectusField>
  children?: ReactNode
}

export const MemberSpotlight = ({ id, fields, full = false, color, children }: Props) => {
  const { member, name, picture, loading } = useMember(id)
  const { setMeta } = useMeta()
  useEffect(() => {
    if (full) setMeta(name || 'Brother', member?.biography, picture)
  }, [full, member, name, picture, setMeta])
  const headingColor = useColorModeValue('primary.700', 'primary.300')
  if (loading || !id || !member) return <Loading />
  const publicPhotos = member.my_photos?.filter((p) => p.is_public) || []
  const levelValue = MemberLevel[member?.user_type || 'subscriber']
  const levelColor = MemberLevelColorMap[levelValue]
  const eventsAttended = member?.events?.filter((e) => e.attended)?.length || 0
  const eventsFlaked =
    member?.events?.filter((e) => e.rsvp == 'confirmed' && e.attended == false)?.length || 0

  return (
    <Flex direction="column" justify="space-between">
      <Box
        px={5}
        py={4}
        bgGradient={full ? `linear(to-bl, ${levelColor[1]}, ${levelColor[0]})` : null}
        borderRadius={['none', '.3rem .3rem 0 0', '1rem 1rem 0 0']}
        color="white"
      >
        <MemberHeader
          member={member}
          zoom={true}
          color={color}
          size={['sm', 'md']}
          minimal={member?.show_profile == false || full == false}
        >
          {children}
          <Spacer />
          <ButtonGroup>
            <MemberChat member={member} />
            <MemberConnect member={member} />
          </ButtonGroup>
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
              <Rating value={member.rating || 0} mt={2} aria-label="User Rating" size="xs" simple />
            )}
          </Flex>
        )}
      </Box>
      {full && member.show_photos && (
        <Box p={2} flex="grow">
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
          fontSize={['xs', 'sm', 'md', 'lg']}
          w="full"
          p={0}
          flex="grow"
          size={['sm', 'md', 'lg']}
          mt={4}
        >
          <TabList>
            <Tab p={1} fontWeight="bold">
              General
            </Tab>
            <Tab p={1} fontWeight="bold">
              Sexual
            </Tab>
            <Tab p={1} fontWeight="bold">
              Interests
            </Tab>
            <Tab p={1} fontWeight="bold">
              Health
            </Tab>
          </TabList>
          <TabPanels maxH="100%" overflowY="auto" my={2} mx={0}>
            <TabPanel>
              <Heading
                as="h3"
                mt={0}
                size="sm"
                mb={2}
                borderBottom="1px solid"
                borderColor={headingColor}
                color={headingColor}
                textTransform="uppercase"
              >
                Features
              </Heading>
              <MemberPropertyGroup
                k="profile"
                member={member}
                fieldList={memberProfileFields}
                show={member?.show_profile}
                fields={fields}
              />
            </TabPanel>
            <TabPanel>
              <Heading
                as="h3"
                mt={0}
                size="sm"
                mb={2}
                borderBottom="1px solid"
                borderColor={headingColor}
                color={headingColor}
                textTransform="uppercase"
              >
                Features
              </Heading>
              <MemberPropertyGroup
                k="explicit"
                member={member}
                fieldList={memberProfileExplicitFields}
                show={member?.show_explicit}
                fields={fields}
                maxCols={2}
              />
              <Heading
                as="h3"
                mt={2}
                size="sm"
                mb={0}
                borderBottom="1px solid"
                borderColor={headingColor}
                color={headingColor}
                textTransform="uppercase"
              >
                Roles
              </Heading>
              <MemberPropertyGroup
                k="explicit_roles"
                member={member}
                fieldList={memberProfileExplicitRolesFields}
                show={member?.show_explicit_roles}
                fields={fields}
                maxCols={2}
              />
            </TabPanel>
            <TabPanel>
              <Heading
                as="h3"
                mt={0}
                size="sm"
                mb={2}
                borderBottom="1px solid"
                borderColor={headingColor}
                color={headingColor}
                textTransform="uppercase"
              >
                Events
              </Heading>
              <MemberPropertyGroup
                k="events"
                member={member}
                fieldList={memberEventFields}
                show={member?.show_events}
                fields={fields}
              />
              <Heading
                as="h3"
                mt={2}
                size="sm"
                mb={0}
                borderBottom="1px solid"
                borderColor={headingColor}
                color={headingColor}
                textTransform="uppercase"
              >
                Sexual
              </Heading>
              <MemberPropertyGroup
                k="interests"
                member={member}
                fieldList={memberInterestsFields}
                show={member?.show_interests}
                fields={fields}
              />
            </TabPanel>
            <TabPanel>
              <Heading
                as="h3"
                mt={0}
                size="sm"
                mb={2}
                borderBottom="1px solid"
                borderColor={headingColor}
                color={headingColor}
                textTransform="uppercase"
              >
                Sexual Health
              </Heading>
              <MemberPropertyGroup
                k="health"
                member={member}
                fieldList={memberProfileHealthFields}
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
      <Flex justify="space-between" gap={4} p={4} align="flex-end">
        {member.buddies.length > 0 && (
          <Stat>
            <StatLabel>
              Added <br />
              Buddies
            </StatLabel>
            <StatNumber>{member.buddies.length}</StatNumber>
          </Stat>
        )}
        {eventsAttended > 0 && (
          <Stat>
            <StatLabel>
              Events
              <br />
              Attended
            </StatLabel>
            <StatNumber>{eventsAttended}</StatNumber>
          </Stat>
        )}
        {eventsFlaked > 0 && (
          <Stat color="accent.500">
            <StatLabel fontWeight="bold" whiteSpace="nowrap">
              Event
              <br />
              No-Shows
            </StatLabel>
            <StatNumber>{eventsFlaked}</StatNumber>
          </Stat>
        )}
      </Flex>
    </Flex>
  )
}
