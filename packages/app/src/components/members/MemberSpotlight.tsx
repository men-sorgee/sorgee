import { capitalCase } from "change-case";
import { useMember, useMeta, useUser } from "hooks";
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
} from "lib/models";
import { toLocalDate } from "lib/utils";
import NextLink from "next/link";
import { ReactNode, useEffect, useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AvatarProps,
  Box,
  Center,
  chakra,
  Flex,
  FlexProps,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
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
  VStack
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/solid";

import {
  Loading,
  Markdown,
  MemberActions,
  MemberHeader,
  MemberIcon,
  MemberMessageStats,
  MemberPropertyGroup,
  MemberRelationBanner,
  PhotoGallery
} from "../";

export type MemberSpotlightProps = FlexProps & {
  memberId: string
  full?: boolean
  updateMeta?: boolean
  color?: string
  size?: AvatarProps['size']
  fields?: Record<string, DirectusField>
  footer?: ReactNode
  header?: ReactNode
  accordionItems?: Array<{
    title: string
    content: ReactNode
  }>
  children?: ReactNode
}

export const MemberSpotlight = chakra(
  ({
    memberId,
    fields,
    full = false,
    color,
    size = ['md', 'lg'],
    updateMeta = false,
    header,
    footer,
    accordionItems,
    children,
    ...props
  }: MemberSpotlightProps) => {
    const [blocked, setBlocked] = useState(false)
    const { member, name, level, picture, loading, reload } = useMember(memberId)
    const { member: me, level: viewerLevel, hasFeature } = useUser()
    const { setMeta } = useMeta()

    useEffect(() => {
      if (full && updateMeta) setMeta(name || 'Brother', member?.biography, picture)
    }, [member, name, picture, full, updateMeta, setMeta])

    useEffect(() => {
      if (!loading && member && me) {
        if (member.blocked.map((b) => b.blocked_id).includes(me.id) && me.user_type != 'staff') {
          setBlocked(true)
        }
      }
    }, [memberId, loading, member, me])

    const headingColor = "white"
    if (loading || !memberId || !member) return <Loading />
    const photos = member.my_photos || []

    photos.sort((a, b) => {
      if (a.is_public && !b.is_public) return -1
      return 1
    })

    const levelColor = MemberLevelColorMap[level]
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

    if (blocked) {
      return (
        <Flex
          direction="column"
          justify="space-between"
          border="1px solid"
          borderColor={'primary.500'}
          rounded="lg"
          bgGradient={`linear(to-bl, ${levelColor[1]}, ${levelColor[0]})`}
          color={headingColor}
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
        bg={'primary.500'}
        {...props}
      >
        <Box
          px={5}
          py={4}
          bgGradient={`linear(to-bl, ${levelColor[1]}, ${levelColor[0]})`}
          color={headingColor}
          borderTopRightRadius="lg"
          borderTopLeftRadius="lg"
          overflow="clip"
        >
          <MemberHeader member={member} size={size} minimal={!full} onChange={() => {
            reload()
          }}>
            {header}
          </MemberHeader>
          {(level == MemberLevel.pledge || viewerLevel == MemberLevel.staff) && (
            <MemberMessageStats memberId={member?.id} viewerLevel={viewerLevel} />
          )}
          {children}
          {full && <Markdown content={member?.biography} />}
        </Box>


        {full && <Accordion defaultIndex={0} rounded="lg" color={headingColor}>
          {accordionItems?.map((item, i) => (
            <AccordionItem key={i}>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color={headingColor}>
                  {item.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box p={2} flex="grow">
                  {item.content}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}

          {full && member.show_photos && photos?.length > 0 && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color={headingColor}>
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
                        private: p.is_public == false,
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
                <Box as="span" flex="1" textAlign="left" color={headingColor}>
                  Stats
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0}>
                <Tabs
                  isFitted
                  variant="enclosed"
                  colorScheme="white"
                  fontSize={['xs', 'sm', 'md', 'lg']}
                  w="full"
                  p={0}
                  flex="grow"
                  size={['sm', 'md', 'lg']}
                  mt={4}
                  color={headingColor}
                >
                  <TabList px={1} >
                    <Tab p={1} borderBottom='none'>
                      General
                    </Tab>
                    <Tab p={1} borderBottom='none'>
                      Sexual
                    </Tab>
                    <Tab p={1} borderBottom='none'>
                      Interest
                    </Tab>
                    <Tab p={1} borderBottom='none'>
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

          {full && member.show_events && level > MemberLevel.pledge && hasFeature('view_attendees') && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" color={headingColor}>
                  Events
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
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
                  Event Stats
                </Heading>
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
                      Event Schedule
                    </Heading>
                    <List>
                      {member?.events
                        ?.filter((e) => ['maybe', 'confirmed'].includes(e.rsvp))
                        .map((e) => {
                          return {
                            id: e.id,
                            event: e.events_id as GroupEvent,
                            rsvp: e.rsvp,
                          }
                        })
                        .filter((e) => e.event.status == 'scheduled')
                        .map((e) => (
                          <ListItem key={e.id} title={e.event.description}>
                            <ListIcon
                              as={e.rsvp == 'confirmed' ? CheckCircleIcon : QuestionMarkCircleIcon}
                              color={e.rsvp == 'confirmed' ? 'green.500' : 'yellow.500'}
                              boxSize={6}
                            />
                            <Link as={NextLink} href={`/events/${e.id}`}>
                              {capitalCase(e.rsvp)} going to {e.event.name} on{' '}
                              {toLocalDate(e.event.datetime).toLocaleDateString()}
                            </Link>
                          </ListItem>
                        ))}
                    </List>
                  </>
                )}
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>}

        {full && (<>
          <MemberRelationBanner member={member} viewer={me} bg={'primary.900'} />
          <Box p={4} bg="primary.700">
            <MemberActions member={member} size="lg" />
          </Box>
        </>
        )}
        {footer}
      </Flex>
    )
  }
)
