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
} from '@chakra-ui/react'
import { Markdown } from './Markdown'
import { GroupEvent } from 'lib/models'
import { getEventDate } from 'lib/utils'
import { capitalCase } from 'change-case'

type EventCardProps = CardProps & {
  showDescription?: boolean
  children?: ReactNode | ReactNode[]
  event: GroupEvent
}

export const EventCard = ({
  event,
  showDescription = true,
  children,
  ...props
}: EventCardProps) => {
  const [eventDate, setEventDate] = useState<{
    day: string
    short: string
    month: string
    date: string
    time: string
  }>()

  const isScheduled = event?.status && event.status !== 'occurred'

  useEffect(() => {
    if (event && !eventDate) {
      setEventDate(getEventDate(event.datetime))
    }
  }, [event, eventDate])

  if (!event) return null

  return (
    <Card p={0} w="full" boxShadow="lg" rounded="md" {...props}>
      <CardHeader p={0}>
        <Flex direction="row" alignItems="stretch" alignContent="center" gap={0}>
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
          >
            {eventDate?.month.toUpperCase()}
            <br />
            <Text size="4xl"> {eventDate?.date}</Text>
          </Heading>
        </Flex>
      </CardHeader>
      {isScheduled && (
        <CardBody w="full">
          <Heading as="h5" size="md" textTransform="uppercase">
            Event Type: {event.invite_only ? 'Private ' : 'Public '} {capitalCase(event.type)}
            <br />
            Door Fee: ${event.cost}
            <br />
            Event Time: {eventDate?.time}
          </Heading>
          {showDescription && <Markdown content={event.description} />}
        </CardBody>
      )}
      <CardFooter flexDirection="column">{children}</CardFooter>
    </Card>
  )
}
