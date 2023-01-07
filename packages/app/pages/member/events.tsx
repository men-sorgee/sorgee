import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import Page from 'components/Page'
import { useMember } from 'hooks'
import { listUserInvites } from 'lib/services/directus/server'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldRadioButtons } from 'components/forms'
import { postJSON } from 'lib/utils'
import { Invite, MemberLevel } from 'lib/models'
import EventCard from 'components/ui/EventCard'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '@/lib/services/auth/config'

export async function getServerSideProps(context) {
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
      titleClass="text-center"
      requireAuth={true}
    >
      {allowed ? (
        <Events {...{ invites }} />
      ) : (
        <>
          <h2>No Events</h2>
          <p>
            Please complete your <Link href="/apply">membership application</Link>.
          </p>
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

function Events({ invites }: { invites: Invite[] }) {
  if (invites.length === 0) {
    return (
      <section className="text-center">
        <h2>No Events</h2>
        <p>Check back later for upcoming events.</p>
      </section>
    )
  }
  return (
    <>
      {invites.map((invite) => (
        <EventInfo key={invite.id} invite={invite} />
      ))}
    </>
  )
}

function EventInfo({ invite }: { invite: Invite }) {
  const [confirmed, setConfirmed] = useState(false)
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

  useEffect(() => {
    if (confirmed) {
      setTimeout(() => {
        setConfirmed(false)
      }, 3000)
    }
  }, [confirmed, rsvp])

  async function respond(data: InviteRSVP) {
    const [ok, response] = await postJSON('/api/member/rsvp', data)
    if (ok) {
      setConfirmed(true)
      setRsvp(data.rsvp)
      return
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any)
    } else {
      setError('form' as any, { message: 'Something went wrong' })
    }
  }
  const message =
    rsvp === 'invited'
      ? 'Please let us know if you can make it!'
      : 'You have already RSVPed. Use the form below to update your response.'
  return (
    <>
      <EventCard invite={invite}>
        <>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(respond)}
              style={{ display: 'contents', width: 'full' }}
            >
              {invite.status == 'scheduled' && (
                <VStack justifyItems="middle" textAlign="center" w={'full'}>
                  <Heading mx={'auto'} maxWidth={{ base: '100%', md: '75%' }}>
                    You are {rsvp}!
                  </Heading>
                  <Text mx={'auto'} maxWidth={{ base: '100%', md: '75%' }} className="text-sm">
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
                    maxWidth={'30%'}
                  />

                  <Button colorScheme={'primary'} type="submit">
                    Update RSVP
                  </Button>
                </VStack>
              )}
              {invite.status == 'occurred' && invite.attended && (
                <VStack justify="center" align="center" spacing={4}>
                  <h4 className="py-2 text-lg">You attended.</h4>
                  <p className="text-sm">Can we get some feedback?</p>
                  <input type="hidden" {...methods.register('event_id')} />
                  <input type="hidden" {...methods.register('user_id')} />

                  <Button color={'primary'} type="submit">
                    Update RSVP
                  </Button>
                </VStack>
              )}
            </form>
          </FormProvider>
          {confirmed && (
            <div className="toast-center toast-middle toast">
              <div className="alert-ghost alert whitespace-nowrap opacity-75">
                <div>
                  <h4>RSVP Updated</h4>
                </div>
              </div>
            </div>
          )}
        </>
      </EventCard>
    </>
  )
}

export default EventPage
