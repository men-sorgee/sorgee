import { ButtonConfirm } from "components";
import { useInvite } from "hooks";
import { EventInvite } from "lib/models";
import { PurchaseResponse } from "lib/services/stripe/client";
import { ApiResult } from "lib/utils";
import { useRouter } from "next/router";
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
  onChange?: () => void
}

export const EventRSVP = ({ eventId, canConfirm, onChange }: RSVPProps) => {
  const router = useRouter()
  const [working, setWorking] = useState(false)
  const [showPayButton, setShowPayButton] = useState<boolean>(undefined)
  const [results, setResults] = useState<string>(undefined)
  const [paid, setPaid] = useState<boolean>(undefined)
  const [nonRefundable, setNonRefundable] = useState<boolean>(undefined)
  const [nonRefundableReason, setNonRefundableReason] = useState<string>(undefined)

  const { invite, event, mutate, pay, refund, loading } = useInvite(eventId)

  useEffect(() => {
    if (!loading && invite && event && showPayButton == undefined) {
      setShowPayButton(event.online_payments && !invite.paid && invite.paid_at == null)
    }
  }, [invite, showPayButton, loading, paid, event])

  useEffect(() => {
    if (!loading && invite) {
      if (router.query.result) setResults(router.query.result as string)
      setPaid(invite.paid || invite.paid_at != null)
    }
  }, [invite, loading, paid, router.query.result])

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

  const cancelRSVP = useCallback(async () => {
    const reason = reasonRef.current.value

    if (paid) {
      let {
        data: { paid: didPay, refunded, reason: noRefundReason, continue: shouldContinue },
      } = await refund(reason || 'Cancelled through website.')
      if (didPay && !refunded) {
        setNonRefundable(true)
        setNonRefundableReason(noRefundReason)
      }
      if (!shouldContinue) {
        setWorking(false)
        setNonRefundableReason(noRefundReason)
        return
      }
    }
    await mutate({ rsvp: 'cancelled', reason })
    setWorking(false)
  }, [paid, mutate, refund])

  const PrePayButton = ({ children = 'Pre-Pay' }) => (
    <>
      {showPayButton && (
        <ButtonConfirm<ApiResult<PurchaseResponse>>
          flex={1}
          alertTitle="Confirm your RSVP"
          buttonText={children}
          confirmedAction={() => {
            setWorking(true)
            return mutate({ paid_at: new Date().toISOString() }).then(() => pay())
          }}
          onSuccess={({ data }) => completePurchase(data)}
          colorScheme="accent"
          w={['full', 'full', 'auto']}
          title="Guarantee your spot at this event and leave your cash at home. Pay now for less hassle later."
        >
          You will be charged for this event today, guaranteeing your place at the event.
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
            return mutate({ rsvp: 'confirmed', paid_at: new Date().toISOString() }).then(() =>
              pay()
            )
          }}
          onSuccess={({ data }) => completePurchase(data)}
          onError={() => {
            setWorking(false)
          }}
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
        confirmedAction={() => {
          setWorking(true)
          return mutate({ rsvp: 'confirmed' })
        }}
        onSuccess={() => {
          setWorking(false)
          if (onChange) onChange()
        }}
        onError={() => {
          setWorking(false)
        }}
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

  const MaybeRSVPButton = ({ children = 'Maybe' }) =>
    !paid && (
      <ButtonConfirm
        flex={1}
        alertTitle="Event RSVP"
        buttonText={children}
        failureMessage="Unable to RSVP."
        successMessage="Your RSVP has been registered."
        confirmedAction={() => {
          setWorking(true)
          return mutate({ rsvp: 'maybe' })
        }}
        onSuccess={() => {
          setWorking(false)
          if (onChange) onChange()
        }}
        onError={() => {
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

  const DeclineRSVPButton = ({ children = 'Cannot Go' }) =>
    !paid && (
      <ButtonConfirm
        flex={1}
        alertTitle="Event RSVP"
        buttonText={children}
        failureMessage="Unable to RSVP."
        successMessage="This invitation has been declined. It will not show anymore."
        confirmedAction={() => {
          setWorking(true)
          return mutate({ rsvp: 'declined' })
        }}
        onSuccess={() => {
          setWorking(false)
          if (onChange) onChange()
        }}
        onError={(err) => {
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

  const CancelRSVPButton = ({ children = 'Cannot Go' }) => (
    <ButtonConfirm
      flex={1}
      alertTitle="Event RSVP"
      buttonText={children}
      failureMessage="Unable to cancel."
      successMessage="Your RSVP has been cancelled."
      confirmedAction={() => {
        setWorking(true)
        return cancelRSVP()
      }}
      onSuccess={() => {
        setWorking(false)
      }}
      onError={() => {
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
        </Text>
        {paid && (
          <Text>
            <strong>There are no refunds if you are within 24 hours of the event-start.</strong>
          </Text>
        )}
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
    heading?: ReactNode | ReactNode[]
    body?: ReactNode | ReactNode[]
    children?: ReactNode | ReactNode[]
    change?: boolean
  }) => (
    <Box rounded="lg" shadow="inset" bg="bg" color="text" mt={2} p={2}>
      <Heading as="h4" size="h4" my={1} color="text">
        {heading}
      </Heading>
      {paid && change && (
        <Text>You pre-paid ${invite?.amount || invite?.event.cost} for this event.</Text>
      )}
      {body}
      {nonRefundable && (
        <Alert rounded="lg" status="warning" my={2}>
          <AlertIcon />
          <Text>
            <strong>
              Your cancellation occurred within 24 hours of the event start time. You may not be
              refunded as the host already purchased supplies.
            </strong>
          </Text>
        </Alert>
      )}
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

  if (results == 'success')
    return (
      <RSVPView
        change={false}
        heading="You purchase just guaranteed a spot at this event!"
        body={<Text>Your payment of ${invite?.event.cost} was successful.</Text>}
      />
    )

  switch (rsvp) {
    case 'confirmed':
      return (
        <>
          <RSVPView
            heading="You are confirmed for this event."
            body={!paid && <Text>You reservation is not guaranteed. First-come, first-serve.</Text>}
          >
            <PayButton>Pre-Pay</PayButton>
            <MaybeRSVPButton>May Not Attend</MaybeRSVPButton>
            <CancelRSVPButton>Cannot Attend</CancelRSVPButton>
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
          <MaybeRSVPButton />
        </RSVPView>
      )

    case 'not_invited':
      return (
        <RSVPView heading="Event Full" change={false}>

        </RSVPView>
      )
    default:
      return (
        <>
          <RSVPView heading="Something went wrong" change={false}></RSVPView>
        </>
      )
  }
}
