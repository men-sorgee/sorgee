import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMember } from 'lib/hooks/use-member';

import { useRouter } from 'next/router';
import Link from 'next/link';
import ApplicationSteps from './_steps';
import { SparklesIcon } from '@heroicons/react/solid';
import Page from '../components/layout/Page';

function Approved() {
  const router = useRouter();
  const { loading, member } = useMember();

  if (
    member &&
    member?.application_status &&
    member.application_status !== 'approved'
  ) {
    router.push('/apply/' + member?.application_status);
    return null;
  }

  return (
    <Page
      title="Application Approved"
      loading={loading}
      sectionClass="gradient p-4 text-center"
      header={<ApplicationSteps status={'approved'} />}
    >
      <>
        <h2>Congratulations! Your membership was approved.</h2>
        <SparklesIcon className="mx-auto my-4 h-[50px] animate-bounce text-white" />
        <p className="text-center">
          You will now get periodic event invites as well as access to our
          member-only content.
        </p>
        <div className="mt-2 flex flex-row items-center justify-center space-x-4 pt-4">
          <Link href="/member/invite">
            <a className="btn-primary btn">Invite a Friend</a>
          </Link>
          <Link href="/member/account">
            <a className="btn-primary btn">Manage Full Profile</a>
          </Link>
        </div>
      </>
    </Page>
  );
}

export default withPageAuthRequired(Approved);
