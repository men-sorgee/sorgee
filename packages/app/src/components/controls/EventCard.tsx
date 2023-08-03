import { AddToCalendarButton } from "add-to-calendar-button-react";
import { capitalCase } from "change-case";
import { differenceInDays, isAfter, isFuture, isToday } from "date-fns";
import { GroupEvent, Location } from "lib/models";
import { getEventDate, toLocalDate } from "lib/utils";
import { ReactNode, useEffect, useState } from "react";
import Countdown from "react-countdown";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Divider,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Show,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { MapPinIcon } from "@heroicons/react/24/solid";

import { Markdown } from "./Markdown";

type EventCardProps = CardProps & {
  showDescription?: boolean
  showLocation?: boolean
  showAddToCalendar?: boolean
  hideBody?: boolean
  hideFooter?: boolean
  children?: ReactNode | ReactNode[]
  footer?: ReactNode | ReactNode[]
  isGuest?: boolean
  isPaid?: boolean
  event: Partial<GroupEvent>
}

export const EventCard = ({
  event,
  showDescription = false,
  showLocation = false,
  showAddToCalendar = false,
  isGuest = false,
  isPaid = false,
  hideBody = false,
  hideFooter = false,
  children,
  footer,
  size,
  padding,
  ...props
}: EventCardProps) => {
  const [viewLocation, setViewLocation] = useState<boolean>(undefined)
  const [eventStartDate, setEventStartDate] = useState<{
    day: string
    short: string
    month: string
    dateOnly: string
    dayOfMonth: string
    date: Date
    time: string
  }>()
  const [eventEndDate, setEventEndDate] = useState<{
    day: string
    short: string
    month: string
    dateOnly: string
    dayOfMonth: string
    date: Date
    time: string
  }>()
  const [date, setDate] = useState<Date>(undefined)

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return isToday(date) ? <h4>Event has started!</h4> : null
    if (days < 99) {
      return (
        <Flex flex="shrink" gap={2} align="center">
          <Stat>
            <StatNumber textAlign="center" fontSize={['lg', 'xl']}>
              {days.toString().padStart(2, '0')}
            </StatNumber>
            <StatHelpText>Days</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber textAlign="center" fontSize={['lg', 'xl']}>
              {hours.toString().padStart(2, '0')}
            </StatNumber>
            <StatHelpText>Hours</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber textAlign="center" fontSize={['lg', 'xl']}>
              {minutes.toString().padStart(2, '0')}
            </StatNumber>
            <StatHelpText>Minutes</StatHelpText>
          </Stat>
          <Stat>
            <StatNumber textAlign="center" fontSize={['lg', 'xl']}>
              {seconds.toString().padStart(2, '0')}
            </StatNumber>
            <StatHelpText>Seconds</StatHelpText>
          </Stat>
        </Flex>
      )
    }
  }

  const location = event?.location as Location
  useEffect(() => {
    if (event && eventStartDate == undefined) {
      setEventStartDate(getEventDate(event.datetime))
      setEventEndDate(getEventDate(event.datetime_end))
    }
    if (
      showLocation &&
      location &&
      eventStartDate?.date &&
      eventEndDate?.date &&
      viewLocation == undefined
    ) {
      let canView =
        differenceInDays(eventStartDate.date, new Date()) <
          location.display_threshold && !isAfter(new Date(), eventEndDate.date)

      setViewLocation(canView && showLocation)
    }
  }, [
    event,
    eventEndDate,
    eventStartDate,
    location,
    showLocation,
    viewLocation
  ])

  const mode = useColorModeValue('light', 'dark')

  if (!event) return null

  return (
    <Card
      p={0}
      w="full"
      borderRadius="15px"
      {...props}
      _hover={{
        boxShadow: 'xl'
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
          <Flex
            direction="column"
            w="75%"
            align="center"
            justify="center"
            p={padding || 4}
          >
            <Heading
              as="h3"
              size={size || ['lg', 'xl', '2xl', '3xl']}
              w="full"
              textAlign="center"
              color="white!important"
              m={0}
            >
              {event.name}
            </Heading>
          </Flex>

          <Flex
            align="center"
            justify="center"
            direction="column"
            bg="primary.700"
            borderRadius="0 15px 0  0"
            p={padding || 4}
            w="25%"
          >
            <Text fontSize={['xs', 'sm', 'sm', 'md']} color="white" m={0} p={0}>
              {eventStartDate?.day}
            </Text>
            <Text
              m={0}
              p={0}
              color="white"
              justifyContent="middle"
              fontSize={size || ['xl', '2xl']}
              whiteSpace="nowrap"
              fontWeight="extrabold"
            >
              {eventStartDate?.month.toUpperCase()}
            </Text>
            <Text fontSize={['xl', '2xl', '4xl']} color="white" m={0} p={0}>
              {event.status == 'planned' && <>&nbsp;</>}
              {eventStartDate?.dayOfMonth}
              {event.status == 'planned' && <>*</>}
            </Text>
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody w="full" pb={0}>
        {!hideBody && (
          <>
            <Flex
              my={2}
              gap={4}
              justify="space-between"
              wrap={['wrap', 'nowrap']}
            >
              <Show above={'md'}>
                <Stat>
                  <StatLabel>Event Type</StatLabel>
                  <StatNumber fontSize={['lg', 'xl', '2xl']}>
                    {capitalCase(event.type)}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Invite Type</StatLabel>
                  <StatNumber fontSize={['lg', 'xl', '2xl']}>
                    {event.invite_only ? 'Exclusive' : 'Open'}
                  </StatNumber>
                </Stat>
              </Show>
              <Stat>
                <StatLabel>Where</StatLabel>
                <StatNumber fontSize={['lg', 'xl', '2xl']}>Denver</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Start Time</StatLabel>
                <StatNumber fontSize={['lg', 'xl', '2xl']}>
                  {eventStartDate?.time}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>End Time</StatLabel>
                <StatNumber fontSize={['lg', 'xl', '2xl']}>
                  {eventEndDate?.time}
                </StatNumber>
              </Stat>
              {event.status == 'scheduled' && (
                <Stat flex="shrink">
                  <StatLabel>Fee</StatLabel>
                  <StatNumber
                    fontSize={['lg', 'xl', '2xl']}
                    textDecoration={isGuest || isPaid ? 'line-through' : ''}
                  >
                    ${event.cost}
                  </StatNumber>
                  {isGuest && <StatHelpText>WAIVED</StatHelpText>}
                  {isPaid && <StatHelpText>PAID</StatHelpText>}
                </Stat>
              )}
            </Flex>

            {showDescription && (
              <>
                <Divider my={4} />
                <Markdown content={event.description} size="md" />
              </>
            )}

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
                    <Icon
                      h={20}
                      w={20}
                      as={MapPinIcon}
                      color="primary.200"
                      fill="primary.500"
                    />

                    <LinkOverlay
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/place/${location.street} ${location.city} ${location.state} ${location.zip}`}
                    >
                      <Text
                        fontWeight="bold"
                        ml={3}
                        colorScheme="primary"
                        my={0}
                      >
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
          </>
        )}
        {children}
      </CardBody>

      {!hideFooter && (
        <CardFooter as={Flex} direction="column">
          <Flex direction={['column', 'row']} gap={4} w="full" align="center">
            {event.status == 'scheduled' &&
              eventStartDate?.dateOnly &&
              showAddToCalendar && (
                <>
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
                            location?.zip
                          ].join(' ')
                        : ''
                    }
                    timeZone="America/Denver"
                    options={[
                      'Apple',
                      'Google',
                      'Outlook.com',
                      'Yahoo',
                      'iCal'
                    ]}
                    buttonStyle="text"
                    hideBackground
                    lightMode={mode}
                  />
                  <Spacer />
                </>
              )}
            {footer}
          </Flex>
          {(event.status == 'planned' && (
            <Text as="em">* This is date is subject to change.</Text>
          )) ||
            (event.status == 'scheduled' &&
              isFuture(eventEndDate?.date || new Date()) && (
                <Countdown date={date} renderer={renderer} />
              ))}
        </CardFooter>
      )}
    </Card>
  )
}
