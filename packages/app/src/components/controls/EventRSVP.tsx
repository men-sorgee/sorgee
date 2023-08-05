import { useInvite } from "hooks";
import { EventInvite } from "lib/models";
import { ApiResult, getJSON } from "lib/utils";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Flex,
  Heading,
  Spinner,
  Text,
  Textarea
} from "@chakra-ui/react";

import { ButtonConfirm } from "./ButtonConfirm";

export type RSVPProps = BoxProps & {
  eventId: string
  onChange?: () => void
  canConfirm: boolean
  invite?: EventInvite
}

export type PurchaseResponse = {
  id: string
  amount: number
}

export const EventRSVP = ({
  eventId,
  invite: eventUser,
  onChange,
  canConfirm
}: RSVPProps) => {
  const [working, setWorking] = useState(false)
  const [showPayButton, setShowPayButton] = useState<boolean>(undefined)

  const { invite, mutate, loading } = useInvite(eventId, eventUser)

  useEffect(() => {
    if (!loading && invite && showPayButton == undefined) {
      setShowPayButton(!invite.paid && !invite.guest)
    }
  }, [invite, showPayButton, loading])

  const reasonRef = useRef<HTMLTextAreaElement>(null)

  const bgGradient = (color) =>
    `linear(to-b, ${color}.400, ${color}.500, ${color}.600)`

  const bgGradientHover = (color) =>
    `linear(to-b, ${color}.300, ${color}.400, ${color}.500)`

  const completePurchase = useCallback(async ( data : PurchaseResponse) => {
    setWorking(false)
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(
      process.env.STRIPE_PUBLIC_KEY ||
        'pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN'
    )
    await stripe.redirectToCheckout({
      sessionId: data.id
    })
  }, [])

  const PrePayButton = ({ children = 'Pre-Pay' }) => (
    <ButtonConfirm<ApiResult<PurchaseResponse>>
      flex={1}
      alertTitle="Confirm your RSVP"
      buttonText={children}
      confirmedAction={() =>
        getJSON<PurchaseResponse>(`/api/stripe/event/${invite.id}`)
      }
      onSuccess={({data}) => completePurchase(data)}
      bgGradient={bgGradient('accent')}
      _hover={{
        bgGradient: bgGradientHover('accent')
      }}
      color="white"
      w={['full', 'full', 'auto']}
      title="Guarantee your spot at this event and leave your cash at home. Pay now for less hassle later."
    >
      You will be charged for this event today, confirming your place at the
      event.
    </ButtonConfirm>
  )

  const ConfirmPayRSVPButton = ({ children = 'Confirm' }) => (
    <ButtonConfirm<ApiResult<PurchaseResponse>>
      flex={1}
      alertTitle="Event RSVP"
      buttonText={children}
      failureMessage="Unable to confirm."
      successMessage="Your RSVP has been registered."
      confirmedAction={() =>
        mutate('confirmed')
          .then(({ data }) => data)
          .then((i: EventInvite) =>
            getJSON<PurchaseResponse>(`/api/stripe/event/${i.id}`)
          )
      }
      onSuccess={({data}) => completePurchase(data)}
      bgGradient={bgGradient('accent')}
      _hover={{
        bgGradient: bgGradientHover('accent')
      }}
      color="white"
      w={['full', 'full', 'auto']}
      title="Guarantee your spot at this event by paying for your spot now."
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

  const PayButton = ({ children = 'Pay Now' }) =>
    (showPayButton && <PrePayButton>{children}</PrePayButton>) || (
      <ConfirmPayRSVPButton>{children}</ConfirmPayRSVPButton>
    )

  const ConfirmRSVPButton = ({ children = 'Confirm' }) => (
    <ButtonConfirm
      flex={1}
      alertTitle="Event RSVP"
      buttonText={children}
      failureMessage="Unable to confirm."
      successMessage="Your RSVP has been registered."
      confirmedAction={() => mutate('confirmed')}
      onSuccess={async () => {
        if (onChange) onChange()
        setWorking(false)
      }}
      bgGradient={bgGradient('accent')}
      _hover={{
        bgGradient: bgGradientHover('accent')
      }}
      color="white"
      w={['full', 'full', 'auto']}
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
      flex={1}
      alertTitle="Event RSVP"
      buttonText={children}
      failureMessage="Unable to RSVP."
      successMessage="Your RSVP has been registered."
      confirmedAction={() => mutate('maybe')}
      onSuccess={async () => {
        if (onChange) onChange()
        setWorking(false)
      }}
      bgGradient={bgGradient('secondary')}
      _hover={{
        bgGradient: bgGradientHover('secondary')
      }}
      color="white"
      w={['full', 'full', 'auto']}
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

  const DeclineRSVPButton = ({ children = 'Cannot Go' }) => (
    <ButtonConfirm
      flex={1}
      alertTitle="Event RSVP"
      buttonText={children}
      failureMessage="Unable to RSVP."
      successMessage="This invitation has been declined. It will not show anymore."
      confirmedAction={() => mutate('declined')}
      onSuccess={async () => {
        if (onChange) onChange()
        setWorking(false)
      }}
      bgGradient={bgGradient('black')}
      _hover={{
        bgGradient: bgGradientHover('black')
      }}
      color="white"
      w={['full', 'full', 'auto']}
    >
      <Text>
        <strong>
          Declined events will be hidden from your calendar and you will not be
          able to see them.
        </strong>
        Are you sure you want to decline this event?
      </Text>
    </ButtonConfirm>
  )

  const CancelRSVPButton = ({ important = false, children = 'Cannot Go' }) => (
    <ButtonConfirm
      flex={1}
      alertTitle="Event RSVP"
      buttonText={children}
      failureMessage="Unable to cancel."
      successMessage="Your RSVP has been cancelled."
      confirmedAction={() => mutate('cancelled', reasonRef.current.value)}
      onSuccess={async () => {
        if (onChange) onChange()
        setWorking(false)
      }}
      focusRef={reasonRef}
      bgGradient={bgGradient(important ? 'red' : 'gray')}
      _hover={{
        bgGradient: bgGradientHover(important ? 'red' : 'gray')
      }}
      color="white"
      w={['full', 'full', 'auto']}
    >
      <>
        <Text>
          Are you sure you want to cancel your RSVP? If so, please provide a
          reason and click the button below.
          {invite?.paid && (
            <strong>
              There are no refunds if you are within 24 hours of the
              event-start.
            </strong>
          )}
        </Text>
        <Textarea
          mt={4}
          ref={reasonRef}
          placeholder="Reason..."
          w="full"
          required
        />
      </>
    </ButtonConfirm>
  )

  const RSVPView = ({
    heading,
    body,
    children,
    change = true
  }: {
    heading: ReactNode | ReactNode[]
    body?: ReactNode | ReactNode[]
    children: ReactNode | ReactNode[]
    change?: boolean
  }) => (
    <Box rounded="lg" shadow="inset" bg="bg" color="text" mt={2} p={2}>
      <Heading as="h4" size="h4" my={1} color="text">
        {heading}
      </Heading>
      {body}
      <Box mt={2}>
        {change && <Text mt={0}>Change of plans?</Text>}
        <Flex
          direction={['column', 'row']}
          mt={4}
          w="full"
          align="center"
          justify="stretch"
          gap="2"
        >
          {children}
        </Flex>
      </Box>
    </Box>
  )

  if (invite?.paid) {
    return (
      <RSVPView heading="You are guaranteed a spot at this event.">
        <CancelRSVPButton important>Cancel Reservation</CancelRSVPButton>
      </RSVPView>
    )
  }

  if (working || loading) return <Spinner m="2rem auto" />
  const rsvp = invite?.rsvp || 'invited'

  switch (rsvp) {
    case 'confirmed':
      return (
        <>
          <RSVPView heading="You have a first-come, first-serve reservation.">
            <PrePayButton>Pre-Pay</PrePayButton>
            <MaybeRSVPButton>May Not Attend</MaybeRSVPButton>
            <CancelRSVPButton important>Cannot Attend</CancelRSVPButton>
          </RSVPView>
        </>
      )
    case 'maybe':
      return (
        <>
          <RSVPView
            heading="You are interested, but have no reservation."
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
            {(canConfirm && (
              <>
                <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
                <PayButton>Can Pre-Pay</PayButton>
              </>
            )) || <PayButton>Can Attend</PayButton>}
            <CancelRSVPButton>Not Interested</CancelRSVPButton>
          </RSVPView>
        </>
      )
    case 'cancelled':
    case 'declined':
      return (
        <RSVPView heading="You are not attending.">
          {(canConfirm && (
            <>
              <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
              <PayButton>Pre-Pay</PayButton>
            </>
          )) || <PayButton />}
          <MaybeRSVPButton />
        </RSVPView>
      )
    default:
      return (
        <>
          <RSVPView heading="You are invited!" change={false}>
            {(canConfirm && (
              <>
                <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
                <PayButton>Pre-Pay</PayButton>
              </>
            )) || <PayButton>Pay to Confirm</PayButton>}
            <MaybeRSVPButton />
            <DeclineRSVPButton />
          </RSVPView>
        </>
      )
  }
}
