import { ButtonBusy, ButtonConfirm } from "components";
import { useInvite } from "hooks";
import { EventInvite } from "lib/models";
import { PurchaseResponse } from "lib/services/stripe/client";
import { ApiResult } from "lib/utils/apis";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  Collapse,
  Flex,
  Heading,
  Spinner,
  Text,
  Textarea,
  useDisclosure
} from "@chakra-ui/react";

export type RSVPProps = BoxProps & {
  eventId: string
  canConfirm: boolean
  invite?: EventInvite
  onChange?: (invite: EventInvite) => void
}

export const EventRSVP = ({ eventId, canConfirm, onChange }: RSVPProps) => {
  const router = useRouter()
  const [working, setWorking] = useState(false)
  const [showPayButton, setShowPayButton] = useState<boolean>(undefined)
  const [results, setResults] = useState<string>(undefined)
  const [paid, setPaid] = useState<boolean>(undefined)
  const [nonRefundable, setNonRefundable] = useState<boolean>(undefined)
  const [nonRefundableReason, setNonRefundableReason] = useState<string>(undefined)
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { invite, event, mutate, pay, refund, loading } = useInvite(eventId)
  const reasonRef = useRef<HTMLTextAreaElement>(null)

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
  }, [invite, loading, paid, router.query.result, mutate])



  const completePurchase = useCallback(async (data: PurchaseResponse) => {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
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
        return invite
      }
    }
    setWorking(false)
    onClose()
    return await mutate({ rsvp: 'cancelled', reason })
  }, [paid, mutate, refund, invite, onClose])

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
          You will be charged for this event today. This will ensure your place at the event.
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
        onSuccess={({ data: i }) => {
          setWorking(false)
          if (onChange) onChange(i)
          onClose()
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
        onSuccess={({ data: i }) => {
          setWorking(false)
          if (onChange) onChange(i)
          onClose()
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

  const DeclineRSVPButton = ({ children = 'Not Interested' }) =>
    !paid && (
      <ButtonBusy
        onClick={() => {
          setWorking(true)
          return mutate({ rsvp: 'declined' })
        }}
        onResult={() => {
          setWorking(false)
          onClose()
        }}
        flex={1}
        colorScheme="gray"
        w={['full', 'full', 'auto']}
      >{children}
      </ButtonBusy>
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
      onSuccess={(i: EventInvite) => {
        setWorking(false)
        if (onChange) onChange(i)
        onClose()
      }}
      onError={() => {
        setWorking(false)
      }}
      focusRef={reasonRef}
      colorScheme="red"
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
    <Box mt={4} rounded="lg" shadow="inset" bg="bg" color="text" p={2}
      borderColor="success.500" >
      <Flex align='start' justify='space-between' gap={2}>
        <Heading as="h5" size="md" mt={0} color="text" >
          {heading}
        </Heading>

        {change && <Button size="xs" mb={1} variant="solid" colorScheme="primary" py={2} onClick={onToggle} >{isOpen ? 'Cancel Changes' : 'Change RSVP'}</Button>}
      </Flex>
      {paid && change && (
        <Text textAlign='left'>You pre-paid ${invite?.amount || invite?.event.cost} to guarantee your spot!</Text>
      )}

      {nonRefundable && (
        <Alert rounded="lg" status="warning" my={2}>
          <AlertIcon />
          <Text>
            <strong>
              Your cancellation occurred within 24 hours of the event start time. You may not be
              refunded as the host already purchased supplies.
            </strong> {nonRefundableReason || ''}
          </Text>
        </Alert>
      )}
      {body}
      {children != undefined &&
        <>

          <Collapse in={isOpen || change == false} animate >
            <Flex
              direction={['column', 'row']}
              w="full"
              align="center"
              justify="stretch"
              gap="2"
              pt={4}
              pb={4}
            >
              {children}
            </Flex>
          </Collapse >
          {!isOpen && showPayButton && rsvp == 'confirmed' && <Box mt={2}><PrePayButton>Pre-Pay to Save Time</PrePayButton></Box>}
        </>
      }
    </Box >
  )

  if (working || loading) return <Spinner m="2rem auto" />
  const rsvp = invite?.rsvp || 'invited'

  if (invite?.event.status == 'planned') {
    return (
      <>
        <Text fontSize="lg" my={2}>This event is tentatively planned, depending on interest.</Text>
        <RSVPView heading="Are you interested?" change={false}>
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
        heading="You are Pre-Paid"
        body={<Text>Your payment of ${invite?.event.cost} was successful.</Text>}
      />
    )

  switch (rsvp) {
    case 'confirmed':
      return (
        <>
          <RSVPView
            heading={paid ? "You are Pre-Paid" : "You are Confirmed"}
            body={(event?.online_payments && !paid) && <Text>You reservation is not pre-paid. If we reach capacity, entrance will be first-come/first-serve.</Text>}
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
            heading="You are Interested"
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
            <DeclineRSVPButton>Not Interested</DeclineRSVPButton>
          </RSVPView>
        </>
      )

    case 'declined':
      return (
        <RSVPView heading="You Declined">
          <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
          <MaybeRSVPButton />
        </RSVPView>
      )
    case 'cancelled':
      return (
        <RSVPView heading="You Cancelled">
          <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
          <MaybeRSVPButton />
        </RSVPView>
      )

    case 'not_invited':
      return (
        <RSVPView heading="Event On Hold" change={false}>

        </RSVPView>
      )
    default:
      return (
        <>
          <RSVPView heading="You are Invited!" change={false}>
            <ConfirmRSVPButton>Can Attend</ConfirmRSVPButton>
            <MaybeRSVPButton></MaybeRSVPButton>
            <DeclineRSVPButton>Not Interested</DeclineRSVPButton>
          </RSVPView>
        </>
      )
  }
}
