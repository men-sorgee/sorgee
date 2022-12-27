import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMember } from 'lib/hooks/use-member';
import { useRouter } from 'next/router';
import ApplicationSteps from './_steps';
import Page from '../components/layout/Page';

function Denied() {
  const router = useRouter();
  const { loading, member } = useMember();

  if (
    member &&
    member?.application_status &&
    member.application_status !== 'denied'
  ) {
    router.push('/apply/' + member?.application_status);
    return null;
  }

  return (
    <Page
      title="Application Denied"
      loading={loading}
      sectionClass="gradient p-4"
      header={<ApplicationSteps status={'denied'} />}
    >
      <>
        <p>Unfortunately, your application was denied.</p>
        <p>{member?.photo_denial_reason}</p>
        <p>
          If this was a mistake or you'd like to appeal, please contact us at{' '}
          <a className="link" href="mailto:support@guysnheat.com">
            support
          </a>
          .
        </p>
      </>
    </Page>
  );
}

export default withPageAuthRequired(Denied);
