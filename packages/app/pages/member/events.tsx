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
} from '@chakra-ui/react'
import Page from 'components/Page'
import { useMember } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldRadioButtons } from 'components/forms'
import { postJSON } from 'lib/utils'
import { Invite, Member, MemberLevel } from 'lib/models'
import EventCard from 'components/ui/EventCard'
import { unstable_getServerSession } from 'next-auth'
import { NextPageContext, GetServerSidePropsResult } from 'next'

type Props = {
  invites: Invite[]
}
export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await unstable_getServerSession(req as any, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const { listUserInvites } = await import('lib/services/directus/server/users')
  const invites = await listUserInvites(session.user.id)

  return {
    props: {
      invites,
    },
  }
}

function EventPage({ invites }: Props) {
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
          <Events {...{ invites, member }} />
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

function Events({ invites, member }: { invites: Invite[]; member: Member }) {
  if (invites?.length === 0) {
    return (
      <Flex direction="column">
        <Heading>No Invites</Heading>
        <Text>
          Check back later for upcoming events. If you never see invitations, make sure your account
          is set to recieve invites and that you never no-show to an event.
        </Text>
      </Flex>
    )
  }
  const upcoming = invites?.filter((i) => i.status == 'scheduled')
  const past = invites?.filter((i) => i.status !== 'scheduled')
  return (
    <>
      {member &&
        upcoming?.map((invite) => <EventInfo key={invite.id} invite={invite} member={member} />)}

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
    <Flex direction="column" justify="start" align="left" gap={4} w="full" mb={8}>
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

function EventInfo({ invite, member }: { invite: Invite; member: Member }) {
  const [working, setWorking] = useState(false)
  const toast = useToast()
  const [rsvp, setRsvp] = useState(invite.rsvp)
  const methods = useForm<InviteRSVP>({
    mode: 'onBlur',
    defaultValues: {
      user_id: invite.users_id as string,
      event_id: invite.events_id as string,
      reason: invite.reason,
      rsvp,
    },
  })
  const { setError } = methods

  const responseOptions = [
    { text: 'Confirmed', value: 'confirmed' },
    { text: 'Maybe', value: 'maybe' },
    { text: 'Declined', value: 'declined' },
  ]

  const respond = useCallback(
    async (data: InviteRSVP) => {
      setWorking(true)
      const [ok, response] = await postJSON('/api/member/rsvp', data)
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
      : 'You have already RSVPed. Use the form below to update your response.'
  return (
    <>
      <EventCard event={invite} level={MemberLevel[member.user_type]}>
        <>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(respond)}
              style={{ display: 'contents', width: 'full' }}
            >
              <Flex
                direction="column"
                justifyItems="center"
                alignItems="center"
                mx={'auto'}
                width={['100%', '50%']}
              >
                <Heading mx={'auto'} maxWidth={{ base: '100%', md: '75%' }} color="text">
                  You are {rsvp}!
                </Heading>
                <Text mx={'auto'} maxWidth={{ base: '100%', md: '75%' }} color="text" size="sm">
                  {message}
                </Text>
                <input type="hidden" {...methods.register('event_id')} />
                <input type="hidden" {...methods.register('user_id')} />
                <FieldRadioButtons
                  field="rsvp"
                  formOptions={responseOptions}
                  registerOptions={{
                    required: true,
                  }}
                  mx={'auto'}
                />

                <Button colorScheme={'primary'} type="submit" disabled={working}>
                  Update RSVP
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </>
      </EventCard>
    </>
  )
}

export default EventPage
