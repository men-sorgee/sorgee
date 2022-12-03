import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from 'lib/hooks/use-member';
import { useRouter } from 'next/router';
import ApplicationSteps from './_steps';
import Loading from 'components/ui/Loading';
import Page from 'components/layout/Page';

function Review() {
  const router = useRouter();
  const { loading, member } = useAppUser();

  if (loading || member?.application_status !== 'review')
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
        <h2>Good things cum to those that wait!</h2>
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
