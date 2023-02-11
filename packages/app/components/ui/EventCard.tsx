import { ReactNode, useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon,
  Flex,
  Heading,
  VStack,
  Divider,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import Markdown from './Markdown'
import { MemberLevel, GroupEvent, Invite } from 'lib/models'

type EventInfo = GroupEvent | Invite

interface Props {
  children?: ReactNode | ReactNode[]
  event: EventInfo
  level?: MemberLevel
}

export default function EventCard({ event, children, level }: Props) {
  const [eventDate, setEventDate] = useState({
    day: '',
    short: '',
    month: '',
    date: '',
    time: '',
  })

  useEffect(() => {
    import('moment').then(({ default: moment }) => {
      const date = moment(event.datetime)
      setEventDate({
        day: date.format('dddd'),
        short: date.format('MMM D'),
        month: date.format('MMM'),
        date: date.format('D'),
        time: date.format('h:mm A'),
      })
    })
  }, [event.datetime])
  const isStaff = level && level >= MemberLevel.staff
  const isScheduled = event.status == 'scheduled'
  return (
    <Card p={0} mt={10} w="full" boxShadow="lg" rounded="lg">
      <CardHeader p={0}>
        <Flex direction="row" alignItems="stretch" gap={0}>
          <Heading
            borderRadius="10px 0 0 0"
            bg="primary.400"
            as="h2"
            size="xl"
            color="white!important"
            textAlign="center"
            w="75%"
            m={0}
            p={4}
          >
            {event.name}
            <br />@ {eventDate.time}
          </Heading>
          <Heading
            as="h3"
            bg="primary.700"
            borderRadius="0 10px 0  0"
            m={0}
            w="25%"
            p={4}
            textAlign="center"
            justifyContent="middle"
            color="white!important"
          >
            {eventDate.month.toUpperCase()}
            <br />
            <Text size="4xl"> {eventDate.date}</Text>
          </Heading>
        </Flex>
      </CardHeader>
      {isScheduled && (
        <CardBody w="full">
          {!isStaff && <Markdown content={event.description} />}

          {level < MemberLevel.staff && (
            <Alert size="sm" mt="4rem" w="full" status="info">
              <AlertIcon />
              Location announced on the day of the event and is sent to confirmed attendees only.
              Events are subject to change or cancellation, depending upon member interest. We will
              communicate any changes to the event 24 hours in advance.
            </Alert>
          )}
        </CardBody>
      )}
      <CardFooter w="full" pb={10} as={Flex} direction="column" align="center">
        {children}
      </CardFooter>
    </Card>
  )
}
