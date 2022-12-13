import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMember } from 'lib/hooks/use-member';
import { useRouter } from 'next/router';
import ApplicationSteps from './_steps';
import Loading from 'components/ui/Loading';
import Page from 'components/layout/Page';

function Review() {
  const router = useRouter();
  const { loading, member } = useMember();

  if (
    member &&
    member?.application_status &&
    member.application_status !== 'review'
  ) {
    router.push('/apply/' + member?.application_status);
    return null;
  }

  return (
    <Page
      title="Verification Review"
      loading={loading}
      sectionClass="gradient p-4"
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
      </>
    </Page>
  );
}

export default withPageAuthRequired(Review);
