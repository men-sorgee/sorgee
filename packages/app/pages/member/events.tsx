import {
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  useToast,
  Center,
  AlertIcon,
  Alert,
  Box,
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useMember } from 'hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldSelect } from 'components/forms'
import { postJSON } from 'lib/utils'
import { EventUser, FieldOptions, Invite, Member, MemberLevel, GroupEvent } from 'lib/models'
import { EventCard } from 'components/controls'
import { getServerSession } from 'next-auth'
import { NextPageContext, GetServerSidePropsResult } from 'next'

type Props = {
  invites: Invite[]
  rsvpOptions: FieldOptions
  eventTypeOptions: FieldOptions
}
export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await getServerSession(req as any, res, authOptions)
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const { listInvites: listUserInvites } = await import('lib/services/directus/server/users')
  const invites = await listUserInvites(session.user.id)

  const { getFieldOptions } = await import('lib/services/directus/server')
  return {
    props: {
      invites,
      rsvpOptions: await getFieldOptions<EventUser>('rsvp', 'events_users'),
      eventTypeOptions: await getFieldOptions<GroupEvent>('type', 'events'),
    },
  }
}

function EventPage({ invites, rsvpOptions, eventTypeOptions }: Props) {
  const [allowed, setAllowed] = useState(false)
  const { member, loading, level } = useMember()

  useEffect(() => {
    if (!loading && member && !allowed) {
      setAllowed(level > 2)
    }
  }, [member, level, loading, allowed])

  return (
    <Page
      loading={loading}
      title="Event Invitations"
      description="Upcoming event invitations."
      requireAuth={true}
    >
      {allowed ? (
        <>
          <Events eventTypeOptions={eventTypeOptions} {...{ invites, member, rsvpOptions }} />
        </>
      ) : (
        <Flex direction="column">
          <Heading>No Invites</Heading>
          <Text>
            Please complete your <Link href="/apply">membership application</Link>.
          </Text>
        </Flex>
      )}
    </Page>
  )
}

type InviteRSVP = {
  user_id: string
  event_id: string
  reason: string
  rsvp?: string
}

function Events({
  invites,
  member,
  rsvpOptions,
  eventTypeOptions,
}: {
  invites: Invite[]
  member: Member
  rsvpOptions: FieldOptions
  eventTypeOptions: FieldOptions
}) {
  if (invites?.length === 0) {
    return (
      <Flex direction="column">
        <Heading>No Invites</Heading>
        <Text>
          Check back later for upcoming events. If you never see invitations, make sure your account
          is set to receive invites and that you never no-show to an event.
        </Text>
        <Text>
          If you confirm attendance to an event and then do not show up, you may be removed from
          future invite lists. If you stop getting invites and think this might have happened, you
          can contact the event organizers to appeal your removal.
        </Text>
      </Flex>
    )
  }
  const getType = (type: string) => {
    let t = eventTypeOptions.find((o) => o.value.toLowerCase() == type.toLowerCase())
    if (t) return t.text
    return type
  }
  console.dir(eventTypeOptions)

  const upcoming = invites?.filter((i) => i.status == 'scheduled')
  const past = invites?.filter((i) => i.status !== 'scheduled')
  return (
    <>
      {member &&
        upcoming?.map((invite) => (
          <EventInfo
            key={invite.id}
            invite={invite}
            member={member}
            rsvpOptions={rsvpOptions}
            type={getType(invite.type)}
          />
        ))}

      {past && past.length > 0 && <h2>Past Invites</h2>}
      {past?.map((invite) => (
        <PastEventInfo key={invite.id} invite={invite} type={getType(invite.type)} />
      ))}
    </>
  )
}

function PastEventInfo({ invite, type }: { invite: Invite; type: string }) {
  const date = new Date(invite.datetime)
  return (
    <Flex direction="column" justify="stretch" align="center" gap={4} w="full" mb={8}>
      <h3>
        {type}: {invite.name} - {date.toLocaleDateString()}
      </h3>
      <h5>
        RSVP: {invite.rsvp.toUpperCase()} | {invite.attended ? 'You attended!' : 'Did not attend'}
      </h5>
      {!invite.attended && invite.rsvp == 'confirmed' && (
        <Alert status="warning">
          <AlertIcon />
          You did not show up, despite being confirmed.
        </Alert>
      )}
      {invite.attended && invite.rsvp == 'invited' && (
        <Alert status="warning">
          <AlertIcon />
          You showed up, but did not RSVP.
        </Alert>
      )}
    </Flex>
  )
}

function EventInfo({
  invite,
  member,
  rsvpOptions,
  type,
}: {
  invite: Invite
  member: Member
  rsvpOptions: FieldOptions
  type: string
}) {
  const [working, setWorking] = useState(false)
  const toast = useToast()
  const { id: event_id } = (invite.events_id as GroupEvent) || {}
  const methods = useForm<InviteRSVP>({
    mode: 'onBlur',
    defaultValues: {
      user_id: invite.users_id as string,
      event_id,
      reason: invite.reason,
      rsvp: invite.rsvp,
    },
  })
  const { setError, watch } = methods

  const rsvp = watch('rsvp')

  const respond = useCallback(
    async (data: InviteRSVP) => {
      setWorking(true)
      const [ok, response] = await postJSON('/api/invite/rsvp', data)
      if (ok) {
        toast({
          title: 'RSVP Updated',
          position: 'bottom',
          description: 'Your RSVP has been updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else if (response.error?.field) {
        setError(response.error!.field as any, response.error.message as any)
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
    [setError, toast]
  )
  const message =
    rsvp === 'invited'
      ? 'Please let us know if you can make it!'
      : 'You have RSVPed. Use the form below to update your response.'
  const form = useRef<HTMLButtonElement>(null)
  return (
    <>
      <EventCard event={invite} level={MemberLevel[member.user_type]} type={type}>
        <>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(respond)}
              style={{ display: 'block', width: '100%' }}
            >
              <Flex direction="column" w="full">
                <input type="hidden" {...methods.register('event_id')} />
                <input type="hidden" {...methods.register('user_id')} />
                <Flex direction={['column', 'column', 'row']} w="full" justify="stretch">
                  <FieldSelect
                    field="rsvp"
                    w="full"
                    p={0}
                    onChange={(_e) => {
                      form.current.dispatchEvent(new Event('submit', { cancelable: true }))
                    }}
                    options={rsvpOptions.filter(
                      (d) => d.value != 'cancelled' && d.value != 'invited'
                    )}
                    registerOptions={{
                      required: true,
                    }}
                  />

                  <Button
                    size="lg"
                    colorScheme="secondary"
                    w="full"
                    mt={2}
                    type="submit"
                    disabled={working}
                  >
                    Update RSVP
                  </Button>
                </Flex>
                {rsvp == 'confirmed' && (
                  <Alert status="warning" mt={4} rounded="lg" shadow="lg">
                    <AlertIcon />
                    <Text>
                      Please only RSVP to events you are sure you can attend! We have to make sure
                      that we have enough space for everyone who wants to attend. Hosts also count
                      on confirmed attendees to help cover the cost of the event.
                    </Text>
                  </Alert>
                )}
              </Flex>
            </form>
          </FormProvider>
        </>
      </EventCard>
    </>
  )
}

export default EventPage
