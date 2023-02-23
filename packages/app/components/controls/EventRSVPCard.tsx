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
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'hooks'
import { Member, FieldOptions, GroupEvent, MemberLevel, EventUser } from '../../lib/models'
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
  event: GroupEvent
  invite?: EventUser
  full?: boolean
  onChange?: () => void
}

export const EventRSVPCard = ({
  member,
  event,
  invite: i,
  full = false,
  onChange,
  ...props
}: RSVPProps) => {
  const today = new Date(new Date().toDateString())
  const eventDate = new Date(new Date(event.datetime).toDateString())
  const isToday = today.getTime() == eventDate.getTime()
  const { reload } = useUser()
  const [working, setWorking] = useState<boolean>(undefined)
  const [invite, setInvite] = useState<RSVPInfo>(undefined)
  const [registered, setRegistered] = useState<boolean>(undefined)
  const toast = useToast()
  const [showTicket, setShowTicket] = useState<boolean>(undefined)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<RSVPInfo>({
    mode: 'onChange',
    defaultValues: invite || {
      user_id: member?.id,
      event_id: event.id,
    },
  })

  useEffect(() => {
    if (member && invite == undefined) {
      const mi = i || member.events?.find((i) => i.events_id === event?.id)
      if (mi) {
        setInvite({
          user_id: member.id,
          event_id: event.id,
          invite_id: mi.id,
          reason: mi.reason,
          rsvp: mi.rsvp,
        })
        setRegistered(mi.rsvp != '<RSVP>')
        setValue('rsvp', mi.rsvp)
      }
    }
  }, [event, invite, i, member, setValue])

  const respond = useCallback(
    async (data: RSVPInfo) => {
      if (!data.rsvp || data.rsvp == 'invited') return
      if (data.rsvp == 'cancelled' && data.reason == undefined) {
        setError('reason', {
          message: 'Please provide a reason for cancelling.',
        })
      }
      setWorking(true)
      const {
        success,
        data: invite,
        error,
      } = await postJSON<EventUser>('/api/events/rsvp', data as any)
      if (success) {
        reset(data)
        setInvite({
          user_id: String(invite.users_id),
          event_id: String(invite.events_id),
          invite_id: invite.id,
          reason: invite.reason,
          rsvp: invite.rsvp,
        })
        setRegistered(true)
        if (onChange) onChange()
        reload()
        toast({
          title: 'RSVP Updated',
          position: 'bottom',
          description: 'Your RSVP has been updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
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
    [onChange, reload, reset, setError, toast]
  )

  const rsvp = watch('rsvp')

  const rsvpOptions = [
    {
      text: '<RSVP>',
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
      text: 'Cancel',
      value: 'cancelled',
    })
  }
  return (
    <>
      <EventCard
        event={event}
        showDescription={rsvp !== 'confirmed'}
        {...props}
        showLocation={rsvp == 'confirmed' && isToday}
      >
        <>
          <form className="no-print" onSubmit={handleSubmit(respond)}>
            <SlideFade in={isDirty && rsvp == 'confirmed'} unmountOnExit>
              <Alert status="info" mb={6} rounded="lg" shadow="lg">
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
            <Box>
              <input type="hidden" {...register('event_id')} />
              <input type="hidden" {...register('user_id')} />
              <input type="hidden" {...register('invite_id')} />
              <Flex gap={2} direction={['column', 'column', 'row']} w="full">
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

                <Button size="lg" colorScheme="gray" w="full" type="submit" disabled={working}>
                  {registered ? 'Change' : 'Register'} RSVP
                </Button>
              </Flex>
              {rsvp == 'cancelled' && (
                <Textarea placeholder="Reason..." w="full" p={0} {...register('reason')} />
              )}
              {errors?.reason && <Text color="red.500">{errors.reason.message}</Text>}
            </Box>
          </form>
          {full && rsvp == 'confirmed' && (
            <>
              <Image
                className="print-only"
                rounded="xl"
                shadow="lg"
                maxW="sm"
                mt={-8}
                src={`/api/code/api/${event.invite_only ? 'invite' : 'events'}/checkin?user_id=${
                  member?.id
                }&event_id=${event?.id}`}
                alt="Ticket"
                w="full"
              />
              <div className="no-print">
                <Flex direction="column">
                  <Flex
                    alignContent="center"
                    justifyContent="center"
                    align="center"
                    bg="gray.200"
                    color="white"
                    mt={6}
                    px={2}
                    py={1}
                    cursor="pointer"
                    _hover={{ bg: 'primary' }}
                    rounded="lg"
                    onClick={() => setShowTicket(!showTicket)}
                  >
                    <Text color="white">{showTicket ? 'Hide' : 'Show'} Ticket</Text>
                  </Flex>
                  <SlideFade in={showTicket} unmountOnExit>
                    <Text textAlign="center">
                      <strong>Important:</strong> Present this ticket to the host when you arrive
                      for access.
                    </Text>
                    <Image
                      rounded="xl"
                      shadow="lg"
                      maxW="md"
                      mt={4}
                      mx="auto"
                      src={`/api/code/api/${
                        event.invite_only ? 'invite' : 'events'
                      }/checkin?user_id=${member?.id}&event_id=${event?.id}`}
                      alt="Ticket"
                      w="full"
                    />
                  </SlideFade>
                </Flex>
              </div>
            </>
          )}
        </>
      </EventCard>
    </>
  )
}
