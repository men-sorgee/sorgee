import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { EventUser, InviteRSVPType, RSVPInfo } from 'lib/models'
import { getJSON, JsonFetcher, postJSON } from 'lib/utils'
import useSWR from 'swr'

import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Button,
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
  canConfirm: boolean
}

export const EventRSVP = ({
  memberId,
  rsvp: r,
  eventId,
  onChange,
  canConfirm
}: RSVPProps) => {
  if (!eventId) throw new Error('EventRSVP requires an event or invite.')
  const [working, setWorking] = useState(false)
  const [showPayButton, setShowPayButton] = useState(false)
  const [invite, setInvite] = useState<Partial<EventUser>>(undefined)
  const {
    data: eventUser,
    mutate,
    isLoading: eventLoading
  } = useSWR<Partial<EventUser>>(
    `/api/events/rsvp?event_id=${eventId}`,
    JsonFetcher,
    {
      fallbackData: {
        users_id: memberId,
        events_id: eventId,
        rsvp: r || 'invited'
      },
      isPaused: () =>
        r != undefined || memberId == undefined || eventId == undefined
    }
  )

  useEffect(() => {
    if (eventLoading == false && invite == undefined && eventUser) {
      setInvite(eventUser)
      setShowPayButton(eventUser.paid == false && eventUser.guest == false)
    }
  }, [eventLoading, eventUser, invite])

  const reasonRef = useRef<HTMLTextAreaElement>(null)
  const bgGradient = (color) =>
    `linear(to-b, ${color}.400, ${color}.500, ${color}.600)`

  const complete = useCallback(
    (success: boolean, data: EventUser) => {
      if (success) {
        setInvite(data)
        mutate(data as EventUser).then(() => {
          if (onChange) onChange()
          setWorking(false)
        })
      }
    },
    [mutate, onChange]
  )

  const CancelRSVPButton = ({ children = 'Something Came Up' }) => (
    <ButtonConfirm
      title="Event RSVP"
      buttonText={children}
      failureMessage="Unable to cancel."
      successMessage="Your RSVP has been cancelled."
      promise={() =>
        postJSON<RSVPInfo>('/api/events/rsvp', {
          event_id: eventId,
          user_id: memberId,
          rsvp: 'cancelled',
          reason: reasonRef.current.value
        })
      }
      complete={complete}
      focusRef={reasonRef}
      bgGradient={bgGradient('gray')}
      color="white"
    >
      <>
        <Text>Are you sure you want to cancel your RSVP?</Text>
        {invite?.paid && (
          <Text mt={4}>
            There are no refunds if you are within 24 hours of the event-start.
          </Text>
        )}
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
      disabled={!canConfirm}
      promise={() =>
        postJSON<RSVPInfo>('/api/events/rsvp', {
          event_id: eventId,
          user_id: memberId,
          rsvp: 'confirmed'
        })
      }
      complete={complete}
      bgGradient={bgGradient('accent')}
      color="white"
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
      promise={() =>
        postJSON<RSVPInfo>('/api/events/rsvp', {
          event_id: eventId,
          user_id: memberId,
          rsvp: 'maybe'
        })
      }
      complete={complete}
      bgGradient={bgGradient('secondary')}
      color="white"
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
      promise={() =>
        postJSON<RSVPInfo>('/api/events/rsvp', {
          event_id: eventId,
          user_id: memberId,
          rsvp: 'declined'
        })
      }
      complete={complete}
      bgGradient={bgGradient('red')}
      color="white"
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

  const processFee = async () => {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(
      process.env.STRIPE_PUBLIC_KEY ||
        'pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN'
    )
    const { data, error, success } = await getJSON<{
      id: string
      amount: number
    }>(`/api/stripe/event/${invite.id}`)
    if (!success) {
      console.error(error)
      return
    }

    await stripe.redirectToCheckout({
      sessionId: data.id
    })
  }

  if (invite?.paid) {
    return (
      <RSVPView heading="You are confirmed and paid for this event.">
        <MaybeRSVPButton>May Not Attend</MaybeRSVPButton>
        <CancelRSVPButton>Can Not Attend</CancelRSVPButton>
      </RSVPView>
    )
  }

  if (working || eventLoading) return <Spinner m="2rem auto" />
  const rsvp = invite?.rsvp || 'invited'

  switch (rsvp) {
    case 'confirmed':
      return (
        <>
          <RSVPView
            heading="You are attending"
            body={
              showPayButton && (
                <Button
                  bgGradient={bgGradient('accent')}
                  size="lg"
                  onClick={processFee}
                >
                  Pre-pay Event Fee
                </Button>
              )
            }
          >
            <MaybeRSVPButton>May Not Attend</MaybeRSVPButton>
            <CancelRSVPButton>Can Not Attend</CancelRSVPButton>
          </RSVPView>
        </>
      )
    case 'maybe':
      return (
        <>
          <RSVPView
            heading="You may attend"
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
        <RSVPView heading="You are not attending">
          <ConfirmRSVPButton />
          <MaybeRSVPButton />
        </RSVPView>
      )
    case 'invited':
      return (
        <>
          <RSVPView heading="You are invited">
            <ConfirmRSVPButton />
            <MaybeRSVPButton />
            <DeclineRSVPButton />
          </RSVPView>
        </>
      )
    default:
      return null
  }
}
