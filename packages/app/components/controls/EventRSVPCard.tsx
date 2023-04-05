import Icon from '@chakra-ui/icon'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import {
  useToast,
  SlideFade,
  Alert,
  AlertIcon,
  Flex,
  Button,
  Text,
  Image,
  CardProps,
  Select,
  Textarea,
  Box,
} from '@chakra-ui/react'
import { useState, useCallback, useEffect, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'hooks'
import {
  Member,
  FieldOptions,
  GroupEvent,
  MemberLevel,
  EventUser,
  EventInvite,
} from '../../lib/models'
import { postJSON } from 'lib/utils'
import { EventCard } from './EventCard'

type RSVPInfo = {
  user_id: string
  event_id: string
  invite_id?: number
  reason?: string
  rsvp?: string
}

type RSVPProps = CardProps & {
  member: Member
  invite: EventInvite
  full?: boolean
  onChange?: () => void
  children?: ReactNode | ReactNode[]
}

export const EventRSVPCard = ({
  member,
  invite,
  full = false,
  onChange,
  children,
  ...props
}: RSVPProps) => {
  const event = invite.event
  const { reload } = useUser()
  const [working, setWorking] = useState<boolean>(undefined)
  const [registered, setRegistered] = useState<boolean>(invite.id != undefined)
  const toast = useToast()
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<RSVPInfo>({
    mode: 'onChange',
    defaultValues: {
      event_id: event.id,
      invite_id: invite.id,
      rsvp: invite.rsvp,
    },
  })

  const respond = useCallback(
    async (data: RSVPInfo) => {
      if (!data.rsvp || data.rsvp == 'invited') return
      if (data.rsvp == 'cancelled' && data.reason == undefined) {
        setError('reason', {
          message: 'Please provide a reason for cancelling.',
        })
      }
      setWorking(true)
      const { success, data: i, error } = await postJSON<EventUser>('/api/events/rsvp', data as any)
      if (success) {
        reset(data)
        setRegistered(true)
        invite.id = i.id

        reload()
        toast({
          title: 'RSVP Updated',
          position: 'bottom',
          description: 'Your RSVP has been updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        if (onChange) onChange()
      } else if (error?.field) {
        setError(error!.field as any, error.message as any)
      } else {
        toast({
          title: 'Something went wrong.',
          position: 'bottom',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      setWorking(false)
    },
    [invite, onChange, reload, reset, setError, toast]
  )

  const rsvp = watch('rsvp')

  const rsvpOptions = [
    {
      text: '',
      value: 'invited',
    },
    {
      text: 'Confirmed',
      value: 'confirmed',
    },
    {
      text: 'Maybe',
      value: 'maybe',
    },
  ] as FieldOptions
  if (registered) {
    rsvpOptions.push({
      text: 'Cancelled',
      value: 'cancelled',
    })
  }

  return (
    <>
      <EventCard
        event={event}
        href={invite.rsvp == 'confirmed' ? `/events/${event.id}` : null}
        showDescription={full}
        showLocation={full}
        isGuest={invite?.guest || false}
        showAddToCalendar={invite.rsvp == 'confirmed' || invite.rsvp == 'maybe'}
        {...props}
      >
        <>
          <form className="no-print" onSubmit={handleSubmit(respond)}>
            <SlideFade in={isDirty && rsvp == 'confirmed'} unmountOnExit>
              <Alert status="info" mb={4} rounded="lg" shadow="lg">
                <AlertIcon />
                <Text>
                  <strong>Only confirm to events you are absolutely sure you can attend.</strong>{' '}
                  Hosts count on confirmed attendees to help cover the cost of the event. You can
                  cancel up to 24 hours before the event without affecting your rating.
                </Text>
              </Alert>
            </SlideFade>
            <SlideFade in={rsvp == 'maybe'} unmountOnExit>
              <Alert status="warning" mb={6} rounded="lg" shadow="lg">
                <AlertIcon />
                <Text>
                  <strong>
                    Only confirmed attendees will be sent the event details on the day of the event.
                  </strong>{' '}
                  Be sure to update your RSVP as soon as you are sure if you can attend or not.
                </Text>
              </Alert>
            </SlideFade>
            <Box mb={2}>
              <input type="hidden" {...register('event_id')} />
              <input type="hidden" {...register('user_id')} />
              <input type="hidden" {...register('invite_id')} />
              <Flex gap={4} direction={['column', 'column', 'row']} w="full">
                <Select
                  w="full"
                  p={0}
                  {...register('rsvp', {
                    required: {
                      value: true,
                      message: 'Please select an RSVP option.',
                    },
                  })}
                >
                  {rsvpOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.text}
                    </option>
                  ))}
                </Select>
                {rsvp == 'cancelled' && (
                  <Textarea placeholder="Reason..." w="full" {...register('reason')} />
                )}
                <Button size="lg" colorScheme="gray" w="full" type="submit" disabled={working}>
                  {registered ? 'Change' : 'Register'} RSVP
                </Button>
              </Flex>

              {errors?.reason && <Text color="red.500">{errors.reason.message}</Text>}
            </Box>
          </form>

          {children}
        </>
      </EventCard>
    </>
  )
}
