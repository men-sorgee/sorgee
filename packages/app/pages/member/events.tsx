import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Button } from 'react-daisyui';
import Page from '../components/layout/Page';
import { useMember } from 'lib/hooks/use-member';
import { listUserInvites } from 'lib/services/directus/server';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageContext } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldRadioButtons } from '../components/forms';
import { postJSON } from 'lib/utils/client';
import { Invite, MemberLevel } from 'lib/models';
import EventCard from '../../components/ui/EventCard';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
  const invites = await listUserInvites(session.user.id);

  return {
    props: {
      invites
    }
  };
}

function EventPage({ invites }: { invites: Invite[] }) {
  const [allowed, setAllowed] = useState(false);
  const { member, loading } = useMember();
  useEffect(() => {
    if (
      !loading &&
      member &&
      MemberLevel[member?.user_type] >= MemberLevel['pledge']
    ) {
      console.dir(MemberLevel[member?.user_type]);
      setAllowed(true);
    }
  }, [member, loading, allowed]);
  return (
    <Page
      loading={loading}
      title="Upcoming Events"
      description="Upcoming events"
      titleClass="text-center"
    >
      {allowed ? (
        <Events {...{ invites }} />
      ) : (
        <>
          <h2>No Events</h2>
          <p>
            Please complete your{' '}
            <Link href="/apply">
              <a>membership application</a>
            </Link>
            .
          </p>
        </>
      )}
    </Page>
  );
}

type InviteRSVP = {
  user_id: string;
  event_id: string;
  reason: string;
  rsvp?: string;
};

function Events({ invites }: { invites: Invite[] }) {
  return (
    <>
      {invites.map((invite) => (
        <EventInfo key={invite.id} invite={invite} />
      ))}
    </>
  );
}

function EventInfo({ invite }: { invite: Invite }) {
  const [confirmed, setConfirmed] = useState(false);
  const [rsvp, setRsvp] = useState(invite.rsvp);
  const [eventDate] = useState<Moment>(moment(invite?.datetime));
  const methods = useForm<InviteRSVP>({
    mode: 'onBlur',
    defaultValues: {
      user_id: invite.users_id as string,
      event_id: invite.events_id as string,
      reason: invite.reason,
      rsvp: rsvp
    }
  });
  const { setError } = methods;

  const responseOptions = [
    { text: 'Confirmed', value: 'confirmed' },
    { text: 'Maybe', value: 'maybe' },
    { text: 'Declined', value: 'declined' }
  ];

  useEffect(() => {
    if (confirmed) {
      setTimeout(() => {
        setConfirmed(false);
      }, 3000);
    }
  }, [confirmed]);

  async function respond(data: InviteRSVP) {
    const [ok, response] = await postJSON('/api/member/rsvp', data);
    if (ok) {
      setConfirmed(true);
      setRsvp(data.rsvp);
      return;
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any);
    } else {
      setError('form' as any, { message: 'Something went wrong' });
    }
  }
  const message =
    rsvp === 'invited'
      ? 'Please let us know if you can make it!'
      : 'You have already RSVPed. Use the form below to update your response.';
  return (
    <>
      <EventCard invite={invite}>
        <>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(respond)}
              className="my-4 w-full "
            >
              {invite.status == 'scheduled' && (
                <>
                  <h4 className="py-2 text-lg">You are {rsvp}!</h4>
                  <p className="text-sm">{message}</p>
                  <input type="hidden" {...methods.register('event_id')} />
                  <input type="hidden" {...methods.register('user_id')} />
                  <FieldRadioButtons
                    className="py-2"
                    field="rsvp"
                    formOptions={responseOptions}
                    registerOptions={{
                      required: true
                    }}
                  />

                  <Button color={'primary'} type="submit">
                    Update RSVP
                  </Button>
                </>
              )}
              {invite.status == 'occurred' && invite.attended && (
                <>
                  <h4 className="py-2 text-lg">You attended.</h4>
                  <p className="text-sm">Can we get some feedback?</p>
                  <input type="hidden" {...methods.register('event_id')} />
                  <input type="hidden" {...methods.register('user_id')} />

                  <Button color={'primary'} type="submit">
                    Update RSVP
                  </Button>
                </>
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
  );
}

export default withPageAuthRequired(EventPage);
