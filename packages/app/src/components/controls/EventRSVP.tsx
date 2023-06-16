import { ReactNode, useCallback, useRef, useState } from 'react'

import { EventUser, InviteRSVPType, RSVPInfo } from '@lib/models'
import { JsonFetcher, postJSON } from '@lib/utils'
import useSWR from 'swr'

import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Heading,
  HStack,
  Spinner,
  Text,
  Textarea
} from '@chakra-ui/react'

import { ButtonConfirm } from './ButtonConfirm'

type RSVPProps = BoxProps & {
  memberId: string
  rsvp?: InviteRSVPType
  eventId: string
  onChange?: () => void
}

export const EventRSVP = ({
  memberId,
  rsvp: r,
  eventId,
  onChange
}: RSVPProps) => {
  if (!eventId) throw new Error('EventRSVP requires an event or invite.')
  const [working, setWorking] = useState(false)
  const { data: eventUser, mutate } = useSWR<Partial<EventUser>>(
    `/api/events/rsvp?event_id=${eventId}`,
    JsonFetcher,
    {
      fallbackData: {
        users_id: memberId,
        events_id: eventId,
        rsvp: r || 'invited'
      },
      isPaused: () => r != undefined
    }
  )

  const invite = eventUser

  const respond = async (data: Partial<RSVPInfo>) => {
    setWorking(true)
    const {
      success,
      data: response,
      error
    } = await postJSON<RSVPInfo>('/api/events/rsvp', {
      event_id: eventId,
      user_id: memberId,
      ...data
    })
    if (!success) throw new Error(error?.message || 'Something went wrong.')
    return response
  }

  const complete = useCallback(
    (success: boolean, data: EventUser) => {
      if (success) {
        invite.id = data.id
        mutate(data as EventUser).then(() => {
          if (onChange) onChange()
          setWorking(false)
        })
      }
    },
    [invite, mutate, onChange]
  )

  const rsvp = invite?.rsvp || 'invited'

  const CancelRSVPButton = ({ children = 'Something Came Up' }) => (
    <ButtonConfirm
      title="Event RSVP"
      buttonText={children}
      failureMessage="Unable to cancel."
      successMessage="Your RSVP has been cancelled."
      promise={() =>
        respond({
          rsvp: 'cancelled',
          reason: reasonRef.current.value
        })
      }
      complete={complete}
      focusRef={reasonRef}
    >
      <>
        <Text>Are you sure you want to cancel your RSVP?</Text>
        <Textarea ref={reasonRef} placeholder="Reason..." w="full" required />
      </>
    </ButtonConfirm>
  )

  const ConfirmRSVPButton = ({ children = 'Confirm' }) => (
    <ButtonConfirm
      title="Event RSVP"
      buttonText={children}
      failureMessage="Unable to confirm."
      successMessage="Your RSVP has been registered."
      colorScheme="primary"
      promise={() =>
        respond({
          rsvp: 'confirmed'
        })
      }
      complete={complete}
    >
      <Text>
        <strong>
          Only confirm to events you are absolutely sure you can attend.
        </strong>{' '}
        Hosts count on confirmed attendees to help cover the cost of the event.
        You can cancel up to 24 hours before the event without affecting your
        rating.
      </Text>
    </ButtonConfirm>
  )

  const MaybeRSVPButton = ({ children = 'Maybe' }) => (
    <ButtonConfirm
      title="Event RSVP"
      buttonText={children}
      failureMessage="Unable to RSVP."
      successMessage="Your RSVP has been registered."
      colorScheme="secondary"
      promise={() =>
        respond({
          rsvp: 'maybe'
        })
      }
      complete={complete}
    >
      <Text>
        <strong>
          Only confirmed attendees will be sent the event details on the day of
          the event.
        </strong>{' '}
        Be sure to update your RSVP as soon as you are sure if you can attend or
        not.
      </Text>
    </ButtonConfirm>
  )

  const DeclineRSVPButton = ({ children = 'Cannot Attend' }) => (
    <ButtonConfirm
      title="Event RSVP"
      buttonText={children}
      failureMessage="Unable to RSVP."
      successMessage="This invitation has been declined. It will not show anymore."
      colorScheme="red"
      promise={() =>
        respond({
          rsvp: 'declined'
        })
      }
      complete={complete}
    >
      <Text>
        <strong>
          Declined events will be hidden from your calendar and you will not be
          able to see them.
        </strong>{' '}
        Are you sure you want to decline this event?
      </Text>
    </ButtonConfirm>
  )

  const RSVPView = ({
    heading,
    body,
    children
  }: {
    heading: ReactNode
    body?: ReactNode
    children: ReactNode
  }) => (
    <>
      <Heading as="h3" size="h3">
        {heading}
      </Heading>
      {body}
      <Box mt={4}>
        <Text mt={0}>Change of plans?</Text>
        <HStack mt={4}>{children}</HStack>
      </Box>
    </>
  )

  const reasonRef = useRef<HTMLTextAreaElement>(null)
  if (working) return <Spinner m="2rem auto" />

  switch (rsvp) {
    case 'confirmed':
      return (
        <>
          <RSVPView heading="Your Are Attending">
            <MaybeRSVPButton>May Not Attend</MaybeRSVPButton>
            <CancelRSVPButton>Can Not Attend</CancelRSVPButton>
          </RSVPView>
        </>
      )
    case 'maybe':
      return (
        <>
          <RSVPView
            heading="You May Attend"
            body={
              <Alert rounded="lg">
                <AlertIcon />
                <Text>
                  <strong>
                    Only confirmed attendees will be sent the event details on
                    the day of the event.
                  </strong>{' '}
                  Be sure to update your RSVP as soon as you are sure if you can
                  attend.
                </Text>
              </Alert>
            }
          >
            <ConfirmRSVPButton>Can Attend Now</ConfirmRSVPButton>
            <CancelRSVPButton>Can Not Attend</CancelRSVPButton>
          </RSVPView>
        </>
      )
    case 'cancelled':
    case 'declined':
      return (
        <RSVPView heading="You Are Not Attending">
          <ConfirmRSVPButton />
          <MaybeRSVPButton />
        </RSVPView>
      )
    case 'invited':
      return (
        <>
          <HStack>
            <ConfirmRSVPButton />
            <MaybeRSVPButton />
            <DeclineRSVPButton />
          </HStack>
        </>
      )
    default:
      return null
  }
}
