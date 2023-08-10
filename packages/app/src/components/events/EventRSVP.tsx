import { ButtonConfirm } from "components";
import { useInvite } from "hooks";
import { EventInvite } from "lib/models";
import { ApiResult, getJSON } from "lib/utils";
import { useSearchParams } from "next/navigation";
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

export type RSVPProps = BoxProps & {
  eventId: string
  canConfirm: boolean
  invite?: EventInvite
}

export type PurchaseResponse = {
  id: string
  amount: number
}

export const EventRSVP = ({ eventId, invite: eventUser, canConfirm }: RSVPProps) => {
  const params = useSearchParams()
  const [working, setWorking] = useState(false)
  const [showPayButton, setShowPayButton] = useState<boolean>(undefined)
  const [paid, setPaid] = useState<boolean>(params.get('success') == 'true' || undefined)
  const { invite, mutate, loading } = useInvite(eventId, eventUser)

  useEffect(() => {
    if (!loading && invite && showPayButton == undefined) {
      setShowPayButton(invite.event.online_payments)
    }
    if (!loading && invite && paid == undefined) {
      setPaid(invite.paid || invite.guest)
    }
  }, [invite, showPayButton, loading, paid, eventUser])

  const reasonRef = useRef<HTMLTextAreaElement>(null)

  const completePurchase = useCallback(async (data: PurchaseResponse) => {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(
      process.env.STRIPE_PUBLIC_KEY ||
        'pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN'
    )
    stripe.redirectToCheckout({
      sessionId: data.id,
    })
  }, [])

  const PrePayButton = ({ children = 'Pre-Pay' }) => (
    <>
      {showPayButton && (
        <ButtonConfirm<ApiResult<PurchaseResponse>>
          flex={1}
          alertTitle="Confirm your RSVP"
          buttonText={children}
          confirmedAction={() => {
            setWorking(true)
            return mutate({ paid: true })
              .then(({ data }) => data)
              .then((i: EventInvite) => getJSON<PurchaseResponse>(`/api/stripe/event/${i.id}`))
          }}
          onSuccess={({ data }) => completePurchase(data)}
          colorScheme="accent"
          w={['full', 'full', 'auto']}
          title="Guarantee your spot at this event and leave your cash at home. Pay now for less hassle later."
        >
          You will be charged for this event today, confirming your place at the event.
        </ButtonConfirm>
      )}
    </>
  )

  const ConfirmPayRSVPButton = ({ children = 'Confirm' }) => (
    <>
      {showPayButton && (
        <ButtonConfirm
          flex={1}
          alertTitle="Event RSVP"
          buttonText={children}
          failureMessage="Unable to confirm."
          successMessage="Your RSVP has been registered."
          confirmedAction={() => {
            setWorking(true)
            return mutate({ rsvp: 'confirmed', paid: true })
              .then(({ data }) => data)
              .then((i: EventInvite) => getJSON<PurchaseResponse>(`/api/stripe/event/${i.id}`))
          }}
          onSuccess={({ data }) => completePurchase(data)}
          colorScheme="accent"
          w={['full', 'full', 'auto']}
          title="Guarantee your spot at this event by paying for your spot now."
        >
          <Text>
            <strong>Only confirm to events you are absolutely sure you can attend.</strong> Hosts
            count on confirmed attendees to help cover the cost of the event. You can cancel up to
            24 hours before the event without affecting your rating.
          </Text>
        </ButtonConfirm>
      )}
    </>
  )

  const PayButton = ({ children = 'Pay Now' }) =>
    (!canConfirm && <PrePayButton>{children}</PrePayButton>) || (
      <ConfirmPayRSVPButton>{children}</ConfirmPayRSVPButton>
    )

  const ConfirmRSVPButton = ({ children = 'Confirm' }) =>
    canConfirm && (
      <ButtonConfirm
        flex={1}
        alertTitle="Event RSVP"
        buttonText={children}
        failureMessage="Unable to confirm."
        successMessage="Your RSVP has been registered."
        confirmedAction={() => mutate({ rsvp: 'confirmed' })}
        colorScheme="accent"
        w={['full', 'full', 'auto']}
      >
        <Text>
          <strong>Only confirm to events you are absolutely sure you can attend.</strong> Hosts
          count on confirmed attendees to help cover the cost of the event. You can cancel up to 24
          hours before the event without affecting your rating.
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
      confirmedAction={() => mutate({ rsvp: 'maybe' })}
      onSuccess={() => {
        setWorking(false)
      }}
      colorScheme="secondary"
      w={['full', 'full', 'auto']}
    >
      <Text>
        <strong>
          Only confirmed attendees will be sent the event details on the day of the event.
        </strong>{' '}
        Be sure to update your RSVP as soon as you are sure if you can attend or not.
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
      confirmedAction={() => mutate({ rsvp: 'declined' })}
      onSuccess={() => {
        setWorking(false)
      }}
      colorScheme="black"
      w={['full', 'full', 'auto']}
    >
      <Text>
        <strong>
          Declined events will be hidden from your calendar and you will not be able to see them.
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
      confirmedAction={() => mutate({ rsvp: 'cancelled', reason: reasonRef.current.value })}
      onSuccess={() => {
        setWorking(false)
      }}
      focusRef={reasonRef}
      colorScheme="blackAlpha"
      w={['full', 'full', 'auto']}
    >
      <>
        <Text>
          Are you sure you want to cancel your RSVP? If so, please provide a reason and click the
          button below.
          {invite?.paid && (
            <strong>There are no refunds if you are within 24 hours of the event-start.</strong>
          )}
        </Text>
        <Textarea mt={4} ref={reasonRef} placeholder="Reason..." w="full" required />
      </>
    </ButtonConfirm>
  )

  const RSVPView = ({
    heading,
    body,
    children,
    change = true,
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

  if (working || loading) return <Spinner m="2rem auto" />
  const rsvp = invite?.rsvp || 'invited'

  if (invite?.event.status == 'planned') {
    return (
      <>
        <Heading>This event is tentatively planned, depending on interest.</Heading>
        <RSVPView heading="Are you interested?!" change={false}>
          <MaybeRSVPButton>Yes</MaybeRSVPButton>
          <DeclineRSVPButton>No</DeclineRSVPButton>
        </RSVPView>
      </>
    )
  }

  switch (rsvp) {
    case 'confirmed':
      if (paid) {
        return (
          <RSVPView heading="You are guaranteed a spot at this event.">
            <CancelRSVPButton>Cancel Reservation</CancelRSVPButton>
          </RSVPView>
        )
      }
      return (
        <>
          <RSVPView heading="You have a first-come, first-serve reservation.">
            <PayButton>Pre-Pay</PayButton>
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
                    Only confirmed attendees will be sent the event details on the day of the event.
                  </strong>{' '}
                  Be sure to update your RSVP as soon as you are sure if you can attend.
                </Text>
              </Alert>
            }
          >
            <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
            <CancelRSVPButton>Not Interested</CancelRSVPButton>
          </RSVPView>
        </>
      )
    case 'cancelled':
    case 'declined':
      return (
        <RSVPView heading="You are not attending.">
          <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>

          <PayButton />
          <MaybeRSVPButton />
        </RSVPView>
      )
    default:
      return (
        <>
          <RSVPView heading="You are invited!" change={false}>
            <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
            <PayButton>Pre-Pay</PayButton>
            <MaybeRSVPButton />
            <DeclineRSVPButton />
          </RSVPView>
        </>
      )
  }
}
