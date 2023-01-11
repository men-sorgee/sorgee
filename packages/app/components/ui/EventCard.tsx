import { ReactNode, useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon,
  HStack,
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
import { MemberLevel, Event } from 'lib/models'

type EventInfo =
  | Event
  | {
      name: string
      description: string
      datetime: string
    }

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
  return (
    <Card p={0} mt={10}>
      <CardHeader p={0}>
        <HStack alignItems="stretch" spacing={0}>
          <Heading
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
            m={0}
            w="25%"
            p={4}
            textAlign="center"
            justifyContent="middle"
            color="white!important"
          >
            {eventDate.month}
            <br />
            <Text size="3xl"> {eventDate.date}</Text>
          </Heading>
        </HStack>
      </CardHeader>
      <CardBody border={'solid 1px primary-900'} borderY={2}>
        <VStack>
          <Accordion defaultIndex={level < MemberLevel.staff ? [0] : null} allowToggle w="full">
            <AccordionItem>
              <Heading>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Party Details
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Heading>
              <AccordionPanel pb={4} style={{ width: 'full' }}>
                <Markdown content={event.description} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {level < MemberLevel.staff && (
            <Alert size="sm" maxW="md" mt="4rem" w="full" status="info">
              <AlertIcon />
              Location announced on the day of the event and is sent to confirmed attendees only.
              Events are subject to change or cancellation, depending upon member interest. We will
              communicate any changes to the event 24 hours in advance.
            </Alert>
          )}
        </VStack>
      </CardBody>
      <Divider />
      <CardFooter>{children}</CardFooter>
    </Card>
  )
}
