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
  FlexProps,
  Spacer,
  chakra,
  useColorModeValue,
  AvatarProps,
} from '@chakra-ui/react'
import { MemberConnect, MemberChat, MemberVouch, MemberHeader, MemberPropertyGroup } from '.'
import { useMember, useMeta, useUser } from 'hooks'
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
  EventUser,
} from 'lib/models'
import { ReactNode, useEffect } from 'react'
import { ImageGallery } from './ImageGallery'
import { Loading } from './Loading'
import { Rating } from './Rating'
import { toLocalDate } from 'lib/utils'

type Props = FlexProps & {
  id: string
  full?: boolean
  updateMeta?: boolean
  color?: string
  size?: AvatarProps['size']
  fields?: Record<string, DirectusField>
  children?: ReactNode
}

export const MemberSpotlight = chakra(
  ({
    id,
    fields,
    full = false,
    color,
    size = ['sm', 'md'],
    updateMeta = false,
    children,
    ...props
  }: Props) => {
    const { member, name, picture, loading, reload } = useMember(id)
    const { setMeta } = useMeta()
    useEffect(() => {
      if (full && updateMeta) setMeta(name || 'Brother', member?.biography, picture)
    }, [full, member, name, picture, setMeta, updateMeta])

    const headingColor = useColorModeValue('primary.700', 'primary.300')
    if (loading || !id || !member) return <Loading />
    const publicPhotos = member.my_photos?.filter((p) => p.is_public) || []
    const levelValue = MemberLevel[member?.user_type || 'subscriber']
    const levelColor = MemberLevelColorMap[levelValue]
    const eventsAttended = member?.events?.filter((e) => e.attended)?.length || 0
    const eventsFlaked =
      member?.events?.filter((e: EventUser) => e.rsvp == 'confirmed' && e.attended == false)
        ?.length || 0
    const eventsConfirmed =
      member?.events?.filter((e: EventUser) => e.rsvp == 'confirmed')?.length || 0
    const eventsMaybe = member?.events?.filter((e: EventUser) => e.rsvp == 'maybe')?.length || 0
    const eventsCancelled =
      member?.events?.filter((e: EventUser) => e.rsvp == 'cancelled')?.length || 0
    const eventsDeclined =
      member?.events?.filter((e: EventUser) => e.rsvp == 'declined')?.length || 0
    return (
      <Flex direction="column" justify="space-between" {...props}>
        <Box
          px={5}
          py={4}
          bgGradient={full ? `linear(to-bl, ${levelColor[1]}, ${levelColor[0]})` : null}
          color="white"
          borderTopRightRadius="lg"
          borderTopLeftRadius="lg"
        >
          <MemberHeader
            member={member}
            zoom={true}
            color={color}
            size={size}
            minimal={member?.show_profile == false || full == false}
          >
            {children}
            <Spacer />
            <Flex gap={1} direction={'row'} align="center" justify="space-between">
              <MemberVouch memberId={member?.id} reload={reload} />
              <MemberChat member={member} />
              <MemberConnect memberId={member?.id} />
            </Flex>
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
                  size="xs"
                  simple
                />
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

        {full && fields && (
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
            <TabList px={1}>
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
        <Flex as={StatGroup} justify="space-between" gap={4} p={4} align="flex-end">
          {eventsDeclined > 0 && (
            <Stat>
              <StatLabel>
                Events
                <br />
                Declined
              </StatLabel>
              <StatNumber>{eventsDeclined}</StatNumber>
            </Stat>
          )}

          <Stat>
            <StatLabel>
              Events
              <br />
              Confirmed
            </StatLabel>
            <StatNumber>{eventsConfirmed}</StatNumber>
          </Stat>
          {eventsMaybe > 0 && (
            <Stat>
              <StatLabel>
                Events
                <br />
                Maybe
              </StatLabel>
              <StatNumber>{eventsMaybe}</StatNumber>
            </Stat>
          )}
          {eventsCancelled > 0 && (
            <Stat>
              <StatLabel>
                Events
                <br />
                Cancelled
              </StatLabel>
              <StatNumber>{eventsCancelled}</StatNumber>
            </Stat>
          )}

          <Stat>
            <StatLabel>
              Events
              <br />
              Attended
            </StatLabel>
            <StatNumber>{eventsAttended}</StatNumber>
          </Stat>
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
)
