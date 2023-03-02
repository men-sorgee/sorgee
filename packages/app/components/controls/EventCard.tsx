import { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Text,
  CardProps,
  LinkBox,
  LinkOverlay,
  Icon,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from '@chakra-ui/react'
import { Markdown } from './Markdown'
import { GroupEvent, Location } from 'lib/models'
import { getEventDate, toLocalDate } from 'lib/utils'
import { capitalCase } from 'change-case'
import { LocationMarkerIcon } from '@heroicons/react/outline'
import { differenceInDays, isBefore } from 'date-fns'

type EventCardProps = CardProps & {
  showDescription?: boolean
  showLocation?: boolean
  children?: ReactNode | ReactNode[]
  event: Partial<GroupEvent>
  href?: string
}

export const EventCard = ({
  event,
  showDescription = true,
  showLocation = false,
  children,
  href,
  ...props
}: EventCardProps) => {
  const [eventDate, setEventDate] = useState<{
    day: string
    short: string
    month: string
    date: string
    time: string
  }>()

  const isScheduled = event?.status && event.status == 'scheduled'

  useEffect(() => {
    if (event && !eventDate) {
      setEventDate(getEventDate(event.datetime))
    }
  }, [event, eventDate])

  if (!event) return null
  const location = event.location as Location
  const viewLocation =
    location &&
    showLocation &&
    differenceInDays(toLocalDate(event.datetime), new Date()) < location.display_threshold

  return (
    <Card p={0} w="full" boxShadow="lg" rounded="md" {...props} _print={{ shadow: 'none' }}>
      <LinkBox>
        <CardHeader p={0}>
          <Flex direction="row" alignItems="stretch" alignContent="middle" gap={0}>
            <Heading
              borderRadius="5px 0 0 0"
              bg="primary.400"
              as="h3"
              size="xl"
              color="white!important"
              textAlign="center"
              w="75%"
              m={0}
              p={4}
            >
              {event.name}
            </Heading>

            <Heading
              as="h4"
              bg="primary.700"
              borderRadius="0 5px 0  0"
              m={0}
              w="25%"
              p={4}
              textAlign="center"
              justifyContent="middle"
              color="white!important"
              fontSize={['xl', '3xl']}
              whiteSpace="nowrap"
            >
              {eventDate?.month.toUpperCase()}
              <br />
              <Text size="4xl"> {eventDate?.date}</Text>
            </Heading>
            {href && <LinkOverlay href={href} />}
          </Flex>
        </CardHeader>
      </LinkBox>
      {isScheduled && (
        <CardBody w="full">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            <Stat>
              <StatLabel>Event Type</StatLabel>
              <StatNumber>{capitalCase(event.type)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Invite Type</StatLabel>
              <StatNumber>{event.invite_only ? 'Invite Only' : 'Brothers Only'}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Start Time</StatLabel>
              <StatNumber>{eventDate?.time}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Fee</StatLabel>
              <StatNumber>${event.cost}</StatNumber>
            </Stat>
          </SimpleGrid>

          {showDescription && (
            <Box maxH="50vh" overflowY="auto">
              <Markdown content={event.description} />
            </Box>
          )}
          {showDescription && (
            <Box>
              <Heading as="h5" textTransform="uppercase" size="md">
                Location:
              </Heading>

              <LinkBox>
                <Flex>
                  <Icon
                    h={20}
                    w={20}
                    as={LocationMarkerIcon}
                    color="primary.200"
                    fill="primary.500"
                  />
                  {(viewLocation && (
                    <LinkOverlay
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/place/${location.street} ${location.city} ${location.state} ${location.zip}`}
                    >
                      <Text fontWeight="bold" ml={3} color="primary.500">
                        {location.name}
                        <br />
                        {location.street} {location.unit}
                        <br />
                        {location.city}, {location.state} {location.zip}
                      </Text>
                    </LinkOverlay>
                  )) || <Text>The location will appear when we are closer to the event-date.</Text>}
                </Flex>
              </LinkBox>
              {viewLocation && <Markdown content={location.notes} />}
            </Box>
          )}
        </CardBody>
      )}
      <CardFooter flexDirection="column">{children}</CardFooter>
    </Card>
  )
}
