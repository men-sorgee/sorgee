import { ReactNode, useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  HStack,
  Heading,
  VStack,
  Divider,
  Text,
} from '@chakra-ui/react'
import Markdown from './Markdown'
import { Invite } from 'lib/models'

export default function EventCard({
  invite,
  children,
}: {
  invite: Invite
  children?: ReactNode | ReactNode[]
}) {
  const [eventDate, setEventDate] = useState({
    day: '',
    short: '',
    month: '',
    date: '',
    time: '',
  })

  useEffect(() => {
    import('moment').then(({ default: moment }) => {
      const date = moment(invite.datetime)
      setEventDate({
        day: date.format('dddd'),
        short: date.format('MMM D'),
        month: date.format('MMM'),
        date: date.format('D'),
        time: date.format('h:mm A'),
      })
    })
  }, [invite.datetime])
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
            {invite.name}
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
          <Markdown content={invite.description} />
          <Alert size={'sm'}>
            Location announced on the day of the event and is sent to confirmed attendees only.
            Events are subject to change or cancellation, depending upon member interest. We will
            communicate any changes to the event 24 hours in advance.
          </Alert>
        </VStack>
      </CardBody>
      <Divider />
      <CardFooter>{children}</CardFooter>
    </Card>
  )
}
