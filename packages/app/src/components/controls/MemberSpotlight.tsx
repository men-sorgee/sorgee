import { ReactNode, useEffect, useState } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { useMember, useMeta, useUser } from 'hooks'
import {
  DirectusField,
  EventUser,
  GroupEvent,
  memberEventFields,
  memberInterestsFields,
  MemberLevel,
  MemberLevelColorMap,
  memberProfileContactFields,
  memberProfileExplicitFields,
  memberProfileExplicitRolesFields,
  memberProfileFields,
  memberProfileHealthFields,
  UserPhoto
} from 'lib/models'
import { EyeSlashIcon } from '@heroicons/react/24/solid'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AvatarProps,
  Box,
  ButtonGroup,
  Center,
  chakra,
  LinkOverlay,
  LinkBox,
  Flex,
  FlexProps,
  Heading,
  Spacer,
  Show,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import {
  MemberBlock,
  MemberChat,
  MemberConnect,
  MemberHeader,
  MemberLike,
  MemberPropertyGroup,
  MemberShare,
  MemberReport,
  MemberIcon,
  Markdown,
  EventCard
} from './'
import { PhotoGallery } from './PhotoGallery'
import { Loading } from './Loading'
import { Rating } from './Rating'
import { toLocalDate } from 'lib/utils/index'
import NextLink from 'next/link'

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
    const [blocked, setBlocked] = useState(false)
    const { member, name, picture, loading } = useMember(id)
    const { member: me } = useUser()
    const { setMeta } = useMeta()

    useEffect(() => {
      if (full && updateMeta)
        setMeta(name || 'Brother', member?.biography, picture)
    }, [member, name, picture, full, updateMeta, setMeta])

    useEffect(() => {
      if (!loading && member && me) {
        if (
          member.blocked.map((b) => b.blocked_id).includes(me.id) &&
          me.user_type != 'staff'
        ) {
          setBlocked(true)
        }
      }
    }, [id, loading, member, me])

    const headingColor = useColorModeValue('primary.700', 'primary.300')
    if (loading || !id || !member) return <Loading />
    const photos = member.my_photos || []

    photos.sort((a, b) => {
      if (a.is_public && !b.is_public) return -1
      return 1
    })
    const levelValue = MemberLevel[member?.user_type || 'subscriber']
    const levelColor = MemberLevelColorMap[levelValue]
    const eventsAttended =
      member?.events?.filter((e) => e.attended)?.length || 0
    const eventsFlaked =
      member?.events?.filter(
        (e: EventUser) => e.rsvp == 'confirmed' && e.attended == false
      )?.length || 0
    const eventsConfirmed =
      member?.events?.filter((e: EventUser) => e.rsvp == 'confirmed')?.length ||
      0
    const eventsMaybe =
      member?.events?.filter((e: EventUser) => e.rsvp == 'maybe')?.length || 0
    const eventsCancelled =
      member?.events?.filter((e: EventUser) => e.rsvp == 'cancelled')?.length ||
      0
    const eventsDeclined =
      member?.events?.filter((e: EventUser) => e.rsvp == 'declined')?.length ||
      0

    if (blocked) {
      return (
        <Flex
          direction="column"
          justify="space-between"
          border="1px solid"
          borderColor={'primary.500'}
          rounded="lg"
          bgGradient={`linear(to-bl, ${levelColor[1]}, ${levelColor[0]})`}
          color="white"
          {...props}
        >
          <MemberIcon member={member} size="lg">
            <Center>
              <VStack>
                <EyeSlashIcon width="30%" fill="red" />
                <Text> You are blocked from viewing this member.</Text>
              </VStack>
            </Center>
          </MemberIcon>
        </Flex>
      )
    }

    return (
      <Flex
        direction="column"
        justify="space-between"
        border="1px solid"
        borderColor={'primary.500'}
        rounded="lg"
        {...props}
      >
        <Box
          px={5}
          py={4}
          bgGradient={`linear(to-bl, ${levelColor[1]}, ${levelColor[0]})`}
          color="white"
          borderTopRightRadius="lg"
          borderTopLeftRadius="lg"
          overflow="clip"
        >
          <MemberHeader
            viewer={me}
            member={member}
            zoom={true}
            color={color}
            size={size}
            minimal={member?.show_profile == false || full == false}
          >
            {member?.rating > 0 && (
              <Show above="md">
                <Rating
                  value={member.rating || 0}
                  mt={2}
                  aria-label="User Rating"
                  size="xs"
                  tooltip="Ratings are based on the number of stars a member has received from other members and event hosts. No-shows automatically receive -1 star ratings by the event."
                />
              </Show>
            )}
          </MemberHeader>

          {full && <Markdown content={member?.biography} />}
          {full && (
            <Box my={2}>
              <Flex w="full">
                <ButtonGroup>
                  <MemberBlock member={member} size="lg" />
                  <MemberReport member={member} size="lg" />
                </ButtonGroup>
                <Spacer />
                <ButtonGroup>
                  <MemberLike member={member} size="lg" />
                  <MemberChat member={member} size="lg" />
                  <MemberConnect member={member} size="lg" />
                  <MemberShare member={member} size="lg" />
                </ButtonGroup>
              </Flex>
              <Flex w="full">
                <Text fontSize="xs">
                  {member?.show_profile && member.last_login && (
                    <>
                      Last Login:{' '}
                      {formatDistanceToNowStrict(
                        toLocalDate(member.last_login)
                      )}{' '}
                      ago
                    </>
                  )}
                </Text>
                <Spacer />
                <Text fontSize="xs">
                  Member Since:{' '}
                  {toLocalDate(
                    member.approved_date || member.date_created
                  ).toLocaleDateString()}
                </Text>
              </Flex>
            </Box>
          )}
        </Box>
        {children}
        <Accordion defaultIndex={0} rounded="lg">
          {full && member.show_photos && photos?.length > 0 && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color="text">
                  Photos
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box p={2} flex="grow">
                  <PhotoGallery
                    images={photos.map((p: UserPhoto) => {
                      return {
                        src: `/api/asset/${p.directus_files_id}`,
                        private: p.is_public == false
                      }
                    })}
                  />
                </Box>
              </AccordionPanel>
            </AccordionItem>
          )}

          {full && fields && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color="text">
                  Stats
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0}>
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
              </AccordionPanel>
            </AccordionItem>
          )}

          {full && member.show_events && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color="text">
                  Events
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Flex
                  as={StatGroup}
                  justify="space-between"
                  gap={4}
                  p={4}
                  align="flex-end"
                >
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
                {member?.events?.length > 0 && (
                  <>
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
                      His Upcoming Events
                    </Heading>
                    {member?.events
                      ?.filter((e) => ['maybe', 'confirmed'].includes(e.rsvp))
                      .map((e) => e.events_id as GroupEvent)
                      .filter((e) => e.status == 'scheduled')
                      .map((e) => (
                        <LinkBox key={e.id}>
                          <EventCard
                            size="lg"
                            event={e}
                            hideBody
                            hideFooter
                            p={2}
                          />
                          <LinkOverlay as={NextLink} href={`/events/${e.id}`} />
                        </LinkBox>
                      ))}
                  </>
                )}
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </Flex>
    )
  }
)
