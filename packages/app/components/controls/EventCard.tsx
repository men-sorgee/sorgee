import { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Button,
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
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  Spacer,
  SimpleGrid,
  Wrap,
  StatHelpText,
} from '@chakra-ui/react'
import Countdown from 'react-countdown'
import { Markdown } from './Markdown'
import { GroupEvent, Location } from 'lib/models'
import { getEventDate, toLocalDate } from 'lib/utils'
import { capitalCase } from 'change-case'
import { LocationMarkerIcon } from '@heroicons/react/outline'
import { differenceInDays, isAfter } from 'date-fns'
import Link from 'next/link'
import { LinkButton } from './LinkButton'
type EventCardProps = CardProps & {
  showDescription?: boolean
  showLocation?: boolean
  children?: ReactNode | ReactNode[]
  isGuest?: boolean
  event: Partial<GroupEvent>
  href?: string
}

export const EventCard = ({
  event,
  showDescription = true,
  showLocation = false,
  isGuest = false,
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

  const renderer = ({ days, hours, completed }) => {
    if (!completed && days < 7) {
      // Render a countdown
      return (
        <h4>
          {days} Days, {hours} hours to go!
        </h4>
      )
    }
  }

  const occurred = event?.status && event.status == 'occurred'

  useEffect(() => {
    if (event && !eventDate) {
      setEventDate(getEventDate(event.datetime))
    }
  }, [event, eventDate])

  if (!event) return null
  const location = event.location as Location
  const viewLocation =
    showLocation &&
    location &&
    differenceInDays(toLocalDate(event.datetime), new Date()) < location.display_threshold &&
    !isAfter(new Date(), toLocalDate(event.datetime))

  return (
    <Card p={0} w="full" boxShadow="lg" borderRadius="15px" {...props} _print={{ shadow: 'none' }}>
      <LinkBox>
        <CardHeader p={0}>
          <Flex
            direction="row"
            alignItems="stretch"
            alignContent="middle"
            gap={0}
            borderRadius="15px 15px 0 0"
            bg="primary.400"
          >
            <Heading
              as="h3"
              size="xl"
              color="white!important"
              textAlign="center"
              w="75%"
              mx={0}
              my="auto"
              p={4}
            >
              {event.name}
            </Heading>

            <Heading
              as="h4"
              bg="primary.700"
              borderRadius="0 15px 0  0"
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
            {href && <LinkOverlay as={Link} href={href} />}
          </Flex>
        </CardHeader>
        <CardBody w="full" pb={0}>
          {event.status == 'planned' && (
            <Box>
              <Text>
                This event is planned, but not yet scheduled. When enough brothers have confirmed
                that this date works for them, the event will be officially scheduled.
              </Text>
              <Divider my={2} />
            </Box>
          )}

          <Flex mb={2} gap={4} justify="space-between" direction={['column', 'row']}>
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
              <StatNumber textDecoration={isGuest ? 'line-through' : ''}>${event.cost}</StatNumber>
              {isGuest && <StatHelpText>WAIVED</StatHelpText>}
            </Stat>
          </Flex>
          <Divider />

          {showDescription && <Markdown content={event.description} size="md" />}
          {viewLocation && (
            <>
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
                  {viewLocation && (
                    <LinkOverlay
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/place/${location.street} ${location.city} ${location.state} ${location.zip}`}
                    >
                      <Text fontWeight="bold" ml={3} colorScheme="primary">
                        {location.name}
                        <br />
                        {location.street} {location.unit}
                        <br />
                        {location.city}, {location.state} {location.zip}
                      </Text>
                    </LinkOverlay>
                  )}
                </Flex>
              </LinkBox>
              <Markdown size="xs" content={location.notes} />
            </>
          )}

          {href && (
            <LinkButton href={href} mt={4} size="lg" w="full" colorScheme="primary">
              Click for Details
            </LinkButton>
          )}
        </CardBody>
      </LinkBox>
      <CardFooter flexDirection="column">
        {children}
        {event.datetime && (
          <>
            <Countdown date={new Date(event.datetime)} renderer={renderer} />
          </>
        )}
      </CardFooter>
    </Card>
  )
}
