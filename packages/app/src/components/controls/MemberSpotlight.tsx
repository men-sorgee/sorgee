import { ReactNode, useEffect } from 'react'

import { formatDistanceToNowStrict } from 'date-fns'
import { useMember, useMeta, useUser } from 'hooks'
import {
  DirectusField,
  EventUser,
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
} from '@lib/models'
import { toLocalDate } from '@lib/utils'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AvatarProps,
  Box,
  chakra,
  Flex,
  FlexProps,
  Heading,
  Spacer,
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
  useColorModeValue
} from '@chakra-ui/react'

import {
  MemberBlock,
  MemberChat,
  MemberConnect,
  MemberHeader,
  MemberLike,
  MemberPropertyGroup,
  MemberShare,
  MemberVouch
} from './'
import { ImageGallery } from './ImageGallery'
import { Loading } from './Loading'
import { Rating } from './Rating'

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
    const { member: me } = useUser()
    const { setMeta } = useMeta()

    useEffect(() => {
      if (full && updateMeta)
        setMeta(name || 'Brother', member?.biography, picture)
    }, [member, name, picture, full, updateMeta, setMeta])

    const headingColor = useColorModeValue('primary.700', 'primary.300')
    if (loading || !id || !member) return <Loading />
    const photos = member.my_photos || []
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

    return (
      <Flex direction="column" justify="space-between" {...props}>
        <Box
          px={5}
          py={4}
          bgGradient={
            full ? `linear(to-bl, ${levelColor[1]}, ${levelColor[0]})` : null
          }
          color="white"
          borderTopRightRadius="lg"
          borderTopLeftRadius="lg"
        >
          <MemberHeader
            viewer={me}
            member={member}
            zoom={true}
            color={color}
            size={size}
            minimal={member?.show_profile == false || full == false}
          >
            {children}
            <Spacer />
            {member?.rating > 0 && (
              <Rating
                value={member.rating || 0}
                mt={2}
                aria-label="User Rating"
                size="xs"
                simple
              />
            )}
          </MemberHeader>
          {full && <Text>{member?.biography}</Text>}
          {full && (
            <Flex justify="space-between">
              <Text fontSize="xs">
                {member.last_login && (
                  <>
                    Last Login:{' '}
                    {formatDistanceToNowStrict(toLocalDate(member.last_login))}{' '}
                    ago
                    <br />
                  </>
                )}
                Member Since:{' '}
                {new Date(member.date_created).toLocaleDateString()}
              </Text>

              <Flex
                gap={1}
                direction={'row'}
                align="center"
                justify="space-between"
              >
                <MemberBlock member={member} />
                <Spacer />
                <MemberVouch member={member} />
                <MemberLike member={member} />
                <MemberChat member={member} />
                <MemberConnect member={member} />
                <MemberShare member={member} />
              </Flex>
            </Flex>
          )}
        </Box>
        <Accordion defaultIndex={0}>
          {full && member.show_photos && member.my_photos?.length > 0 && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Photos
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box p={2} flex="grow">
                  {photos.length > 0 && (
                    <ImageGallery
                      images={photos.map((p: UserPhoto) => {
                        return {
                          src: `/api/asset/${p.directus_files_id}`,
                          private: p.is_public == false
                        }
                      })}
                    />
                  )}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          )}

          {full && fields && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
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
                <Box as="span" flex="1" textAlign="left">
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
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </Flex>
    )
  }
)
