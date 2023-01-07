import moment, { Moment } from 'moment'
import { ReactNode, useState } from 'react'
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
  const [eventDate] = useState<Moment>(moment(invite.datetime))
  return (
    <Card p={0} mt={10}>
      <CardHeader p={0}>
        <HStack alignItems="stretch" spacing={0}>
          <Heading
            bg={'primary.400'}
            as="h2"
            size="xl"
            color="white"
            textAlign={'center'}
            w={'75%'}
            m={0}
            p={4}
          >
            {invite.name}
            <br />@ {eventDate.format('h:mm A')}
          </Heading>
          <Heading
            as="h3"
            bg={'primary.900'}
            m={0}
            w={'25%'}
            p={4}
            textAlign={'center'}
            color={'white'}
          >
            {eventDate.format('MMM')}
            <br />
            {eventDate.format('D')}
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
