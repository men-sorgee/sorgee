import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from 'lib/hooks/use-member';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeta } from 'lib/hooks/user-meta-context';
import ApplicationSteps from './_steps';
import Page from 'components/layout/Page';

function Denied() {
  useMeta('Denied');
  const router = useRouter();
  const { loading, member } = useAppUser();

  useEffect(() => {
    if (member && member!.application_status !== 'denied') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  return (
    <Page
      title="Application Denied"
      loading={loading}
      header={<ApplicationSteps status={'denied'} />}
    >
      <>
        <p>Unfortunately, your application was denied.</p>
        <p>
          You should receive an email with more information. To re-apply or
          appeal, please contact us at{' '}
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
