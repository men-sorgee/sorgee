import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Alert, Button, Card } from 'react-daisyui';
import Page from 'components/layout/Page';
import { useMember } from 'lib/hooks/use-member';
import { listUserInvites } from 'lib/services/directus/server';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageContext } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldRadioButtons } from 'components/forms';
import { postJSON } from 'lib/utils/client';
import Loading from 'components/ui/Loading';
import Markdown from 'components/layout/Markdown';
import { Invite, MemberLevel } from 'models';
import { getCookie } from 'cookies-next';
import { memberCookie } from 'config/client';

export async function getServerSideProps({ req }: NextPageContext) {
  const memberId = getCookie(memberCookie, { req }) as string;
  if (!memberId) {
    return {
      props: {}
    };
  }
  const invites = await listUserInvites(memberId);

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
        <EventCard key={invite.id} invite={invite} />
      ))}
    </>
  );
}

function EventCard({ invite }: { invite: Invite }) {
  const [confirmed, setConfirmed] = useState(false);
  const [rsvp, setRsvp] = useState(invite.rsvp);
  const [eventDate] = useState<Moment>(moment(invite.datetime));
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
    const [ok, response] = await postJSON('/api/admin/rsvp', data);
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
      <Card className="gradient not-prose mx-auto max-w-lg text-center">
        <div className="flex items-center justify-between self-stretch  align-middle">
          <h2 className="m-0 w-3/4 text-center text-xl !text-white">
            {invite.name}
            <br />@ {eventDate.format('h:mm A')}
          </h2>

          <h3 className="m-0 bg-primary-900 px-8 py-2 text-center">
            {eventDate.format('MMM')}
            <br />
            {eventDate.format('D')}
          </h3>
        </div>
        <Card.Body className="border-y-2 border-primary-900">
          <Markdown content={invite.description} />
          <Alert className="italics mt-2 text-sm">
            Location announced on the day of the event and is sent to confirmed
            attendees only. Events are subject to change or cancellation,
            depending upon member interest. We will communicate any changes to
            the event 24 hours in advance.
          </Alert>
        </Card.Body>
        <Card.Actions className="border-t-1 border-primary-700 bg-primary-900">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(respond)}
              className="my-4 w-full "
            >
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
            </form>
          </FormProvider>
        </Card.Actions>
        {confirmed && (
          <div className="toast-center toast-middle toast">
            <div className="alert-ghost alert whitespace-nowrap opacity-75">
              <div>
                <h4>RSVP Updated</h4>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

export default withPageAuthRequired(EventPage, {
  onRedirecting: () => <Loading />
});
