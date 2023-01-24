import { Button, Heading, Text, VStack, Flex, useToast, Center } from '@chakra-ui/react'
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
import { authOptions } from '@/lib/auth/config'

export async function getServerSideProps(context) {
  const { listUserInvites } = await import('lib/services/directus/server')

  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const invites = await listUserInvites(session.user.id)

  return {
    props: {
      invites,
    },
  }
}

function EventPage({ invites }: { invites: Invite[] }) {
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
      title="Upcoming Events"
      description="Upcoming events"
      requireAuth={true}
    >
      {allowed ? (
        <Events {...{ invites, member }} />
      ) : (
        <>
          <Heading>No Events</Heading>
          <Text>
            Please complete your <Link href="/apply">membership application</Link>.
          </Text>
        </>
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
      <Center>
        <Heading>No Events</Heading>
        <Text>Check back later for upcoming events.</Text>
      </Center>
    )
  }
  return (
    <>
      {member &&
        invites?.map((invite) => <EventInfo key={invite.id} invite={invite} member={member} />)}
    </>
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
              {invite.status == 'scheduled' && (
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
              )}
              {invite.status == 'occurred' && invite.attended && (
                <VStack justify="center" align="center" spacing={4}>
                  <Heading as="h4" py={2} size={'lg'}>
                    You attended.
                  </Heading>
                  <Text>Can we get some feedback?</Text>
                  <input type="hidden" {...methods.register('event_id')} />
                  <input type="hidden" {...methods.register('user_id')} />

                  <Button color={'primary'} type="submit">
                    Update RSVP
                  </Button>
                </VStack>
              )}
            </form>
          </FormProvider>
        </>
      </EventCard>
    </>
  )
}

export default EventPage
