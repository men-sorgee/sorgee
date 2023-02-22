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
import { GroupEvent, Member, MemberLevel } from 'lib/models'
import { getEventDate } from 'lib/utils'
import { capitalCase } from 'change-case'

type EventCardProps = CardProps & {
  children?: ReactNode | ReactNode[]
  event: GroupEvent
  member: Member
}

export const EventCard = ({ event, member, children, ...props }: EventCardProps) => {
  const [eventDate, setEventDate] = useState<{
    day: string
    short: string
    month: string
    date: string
    time: string
  }>()

  const user_type = member.user_type
  const level = MemberLevel[user_type]
  const isStaff = level && level >= MemberLevel.staff
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
        <Flex direction="row" alignItems="stretch" gap={0}>
          <Heading
            borderRadius="5px 0 0 0"
            bg="primary.400"
            as="h2"
            size="xl"
            color="white!important"
            textAlign="center"
            w="75%"
            m={0}
            p={4}
          >
            {event.name} @ {eventDate?.time}
          </Heading>

          <Heading
            as="h3"
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
          </Heading>
          <Markdown content={event.description} />
        </CardBody>
      )}
      <CardFooter flexDirection="column">{children}</CardFooter>
    </Card>
  )
}
