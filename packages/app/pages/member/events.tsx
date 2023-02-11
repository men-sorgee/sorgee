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
import EventCard from 'components/ui/EventCard'
import { getServerSession } from 'next-auth'
import { NextPageContext, GetServerSidePropsResult } from 'next'

type Props = {
  invites: Invite[]
  rsvpOptions: FieldOptions
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
    },
  }
}

function EventPage({ invites, rsvpOptions }: Props) {
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
          <Text>
            Please only RSVP to events you are sure you can attend! We have to make sure that we
            have enough space for everyone who wants to attend. Hosts also count on confirmed
            attendees to help cover the cost of the event.
          </Text>
          <Text>
            If you confirm attendance to an event and then do not show up, you may be removed from
            future invite lists. If you stop getting invites and think this might have happened, you
            can contact the event organizers to appeal your removal.
          </Text>
          <Events {...{ invites, member, rsvpOptions }} />
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
}: {
  invites: Invite[]
  member: Member
  rsvpOptions: FieldOptions
}) {
  if (invites?.length === 0) {
    return (
      <Flex direction="column">
        <Heading>No Invites</Heading>
        <Text>
          Check back later for upcoming events. If you never see invitations, make sure your account
          is set to receive invites and that you never no-show to an event.
        </Text>
      </Flex>
    )
  }
  const upcoming = invites?.filter((i) => i.status == 'scheduled')
  const past = invites?.filter((i) => i.status !== 'scheduled')
  return (
    <>
      {member &&
        upcoming?.map((invite) => (
          <EventInfo key={invite.id} invite={invite} member={member} rsvpOptions={rsvpOptions} />
        ))}

      {past && past.length > 0 && <h2>Past Invites</h2>}
      {past?.map((invite) => (
        <PastEventInfo key={invite.id} invite={invite} />
      ))}
    </>
  )
}

function PastEventInfo({ invite }: { invite: Invite }) {
  const date = new Date(invite.datetime)
  return (
    <Flex direction="column" justify="stretch" align="center" gap={4} w="full" mb={8}>
      <h3>
        {invite.name} - {date.toLocaleDateString()}
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
}: {
  invite: Invite
  member: Member
  rsvpOptions: FieldOptions
}) {
  const [working, setWorking] = useState(false)
  const toast = useToast()
  const [rsvp, setRsvp] = useState<string>()
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
  const { setError } = methods

  useEffect(() => {
    if (invite.rsvp && !rsvp) setRsvp(invite.rsvp), [invite.rsvp, rsvp]
  }, [invite.rsvp, rsvp])

  const respond = useCallback(
    async (data: InviteRSVP) => {
      setWorking(true)
      const [ok, response] = await postJSON('/api/invite/rsvp', data)
      if (ok) {
        setRsvp(data.rsvp)
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
      <EventCard event={invite} level={MemberLevel[member.user_type]}>
        <>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(respond)} style={{ display: 'block' }}>
              <Flex direction="column" w="full">
                <Heading mt={0} textAlign="center">
                  Your Response:
                </Heading>
                <Heading as="h1" textAlign="center">
                  {rsvp?.toUpperCase() || '*crickets*'}
                </Heading>
                <Text color="text" size="sm">
                  {message}
                </Text>
                <input type="hidden" {...methods.register('event_id')} />
                <input type="hidden" {...methods.register('user_id')} />
                <Box w={['full', '50%']} mx="auto">
                  <FieldSelect
                    field="rsvp"
                    onChange={(_e) => {
                      form.current.dispatchEvent(new Event('submit', { cancelable: true }))
                    }}
                    options={rsvpOptions.filter(
                      (d) => d.value != 'cancelled' && d.value != 'invited'
                    )}
                    registerOptions={{
                      required: true,
                    }}
                    p={10}
                  />
                  <Button
                    mt={8}
                    size="lg"
                    colorScheme={'primary'}
                    w="full"
                    type="submit"
                    disabled={working}
                  >
                    Update RSVP
                  </Button>
                </Box>
              </Flex>
            </form>
          </FormProvider>
        </>
      </EventCard>
    </>
  )
}

export default EventPage
