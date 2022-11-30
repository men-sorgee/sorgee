import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from 'lib/hooks/use-member';

import { NextRouter, useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';
import ApplicationSteps from './_steps';
import Loading from 'components/ui/Loading';
import { useMeta } from 'lib/hooks/user-meta-context';
import Page from 'components/layout/Page';

function Review() {
  useMeta('Review');
  const router = useRouter();
  const { loading, member } = useAppUser();

  useEffect(() => {
    if (!loading && member && member!.application_status !== 'review') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  if (loading)
    return (
      <Loading>
        <h3>Loading</h3>
      </Loading>
    );

  return (
    <Page
      title="Verification Review"
      loading={loading}
      header={<ApplicationSteps status={'review'} />}
    >
      <>
        <h3>Good things cum to those that wait!</h3>
        <p className="text-center text-xl">
          Thank you for submitting your application and verification photo.
        </p>
        <p className="text-center">
          Your application is currently being reviewed by our team. You will
          receive an email with our decision within 7 days.
        </p>
        <Loading>
          <h3>Under Review</h3>
        </Loading>
      </>
    </Page>
  );
}

export default withPageAuthRequired(Review);
