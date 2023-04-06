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
  StatHelpText,
  Spacer,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import Countdown from 'react-countdown'
import { Markdown } from './Markdown'
import { GroupEvent, Location } from 'lib/models'
import { getEventDate, toLocalDate } from 'lib/utils'
import { capitalCase } from 'change-case'
import { MapPinIcon } from '@heroicons/react/24/solid'
import { differenceInDays, isAfter, isToday } from 'date-fns'
import Link from 'next/link'
import { LinkButton } from './LinkButton'
import { AddToCalendarButton } from 'add-to-calendar-button-react'
import { EventBadge } from './EventBadge'
type EventCardProps = CardProps & {
  showDescription?: boolean
  showLocation?: boolean
  showAddToCalendar?: boolean
  children?: ReactNode | ReactNode[]
  footer?: ReactNode | ReactNode[]
  isGuest?: boolean
  event: Partial<GroupEvent>
  href?: string
}

export const EventCard = ({
  event,
  showDescription = true,
  showLocation = false,
  showAddToCalendar = false,
  isGuest = false,
  children,
  footer,
  href,
  ...props
}: EventCardProps) => {
  const [eventDate, setEventDate] = useState<{
    day: string
    short: string
    month: string
    dateOnly: string
    dayOfMonth: string
    date: Date
    time: string
  }>()

  let date = new Date(event.datetime)

  const renderer = ({ days, hours, minutes, completed }) => {
    if (completed) return isToday(date) ? <h4>Event has started!</h4> : null
    if (days < 7) {
      // Render a countdown
      return (
        <Heading as="h4" size="h4" my={2}>
          {days} Days, {hours} hours
          {days < 4 && <span>, {minutes} minutes</span>}&nbsp;to go!
        </Heading>
      )
    }
  }

  useEffect(() => {
    if (event && !eventDate) {
      setEventDate(getEventDate(event.datetime))
    }
  }, [event, eventDate])
  const mode = useColorModeValue('light', 'dark')
  if (!event) return null

  const location = event.location as Location
  const viewLocation =
    showLocation &&
    location &&
    differenceInDays(toLocalDate(event.datetime), new Date()) < location.display_threshold &&
    !isAfter(new Date(), toLocalDate(event.datetime))

  return (
    <Card
      p={0}
      w="full"
      borderRadius="15px"
      {...props}
      _hover={{
        boxShadow: 'xl',
      }}
      _print={{ shadow: 'none' }}
    >
      <CardHeader p={0}>
        <Flex
          direction="row"
          alignItems="stretch"
          alignContent="middle"
          gap={0}
          borderRadius="15px 15px 0 0"
          bg="primary.400"
        >
          <Flex direction="column" w="75%" align="center" justify="center" p={4}>
            <Heading as="h3" size="2xl" w="full" textAlign="center" color="white!important" m={0}>
              {event.name}
            </Heading>
          </Flex>

          <Flex
            align="center"
            justify="center"
            direction="column"
            bg="primary.700"
            borderRadius="0 15px 0  0"
            p={4}
            w="25%"
          >
            <Heading
              as="h4"
              m={0}
              color="white"
              justifyContent="middle"
              fontSize={['xl', '3xl']}
              whiteSpace="nowrap"
            >
              {eventDate?.month.toUpperCase()}
            </Heading>
            <Text fontSize="4xl" color="white" m={0}>
              {eventDate?.dayOfMonth} {event.status == 'planned' && <>*</>}
            </Text>
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody w="full" pb={0}>
        <Flex mb={2} gap={4} justify="space-between" wrap={['wrap', 'nowrap']}>
          <Stat>
            <StatLabel>Event Type</StatLabel>
            <StatNumber fontSize={['lg', 'xl', '2xl']}>{capitalCase(event.type)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Invite Type</StatLabel>
            <StatNumber fontSize={['lg', 'xl', '2xl']}>
              {event.invite_only ? 'Exclusive' : 'Open'}
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Start Time</StatLabel>
            <StatNumber fontSize={['lg', 'xl', '2xl']}>{eventDate?.time}</StatNumber>
          </Stat>
          {event.status == 'scheduled' && (
            <Stat flex="shrink">
              <StatLabel>Fee</StatLabel>
              <StatNumber
                fontSize={['lg', 'xl', '2xl']}
                textDecoration={isGuest ? 'line-through' : ''}
              >
                ${event.cost}
              </StatNumber>
              {isGuest && <StatHelpText>WAIVED</StatHelpText>}
            </Stat>
          )}
        </Flex>

        <Divider my={2} />
        {event.status == 'planned' && (
          <>
            <Text as="em">* This is date is subject to change.</Text>
            <Divider my={2} />
          </>
        )}
        {showDescription && <Markdown content={event.description} size="md" />}

        {date && <Countdown date={date} renderer={renderer} />}

        {viewLocation && (
          <>
            <Heading as="h5" textTransform="uppercase" size="md">
              Location:
            </Heading>

            <LinkBox>
              <Flex
                w={['full', 'full', 'fit-content']}
                mt={[4, 4, 0]}
                ml={[0, 0, 4]}
                mb={4}
                border="1px dashed"
                p={2}
                rounded="lg"
                borderColor="text"
                float={['none', 'none', 'right']}
              >
                <Icon h={20} w={20} as={MapPinIcon} color="primary.200" fill="primary.500" />

                <LinkOverlay
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/place/${location.street} ${location.city} ${location.state} ${location.zip}`}
                >
                  <Text fontWeight="bold" ml={3} colorScheme="primary" my={0}>
                    {location.name}
                    <br />
                    {location.street} {location.unit}
                    <br />
                    {location.city}, {location.state} {location.zip}
                  </Text>
                </LinkOverlay>
              </Flex>
            </LinkBox>
            <Markdown size="xs" content={location.notes} />
          </>
        )}
        {children}
      </CardBody>
      <CardFooter>
        {eventDate?.dateOnly && showAddToCalendar && (
          <AddToCalendarButton
            uid={event.id}
            size="2"
            trigger="click"
            name={event.name}
            description={event.description}
            startDate={event.datetime}
            endDate={event.datetime_end}
            location={
              viewLocation
                ? [
                    location?.street,
                    location?.unit,
                    location?.city,
                    location?.state,
                    location?.zip,
                  ].join(' ')
                : ''
            }
            timeZone="America/Denver"
            options={['Apple', 'Google', 'Outlook.com', 'Yahoo', 'iCal']}
            buttonStyle="text"
            hideBackground
            lightMode={mode}
          />
        )}
      </CardFooter>
    </Card>
  )
}
