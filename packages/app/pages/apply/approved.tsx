import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from 'lib/hooks/use-member';

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';
import Link from 'next/link';
import ApplicationSteps from './_steps';
import { SparklesIcon } from '@heroicons/react/solid';

function Approved() {
  const router = useRouter();
  const { loading, member } = useAppUser();

  useEffect(() => {
    if (member && member!.application_status !== 'approved') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  return (
    <>
      <Head>
        <title>Approved</title>
      </Head>
      <section className="dark text-center">
        <h1>Application Approved</h1>
        <ApplicationSteps status={'approved'} />
        <h2>Congratulations! Your membership was approved.</h2>
        <SparklesIcon className="mx-auto my-10 h-[50px] animate-bounce" />
        <p className="text-center">
          You will now get periodic event invites as well as access to our
          member-only content.
        </p>
        <div className="mt-2 flex flex-row items-center justify-center space-x-4 pt-4">
          <Link href="/member/invite">
            <a className="btn-primary btn">Invite a Friend</a>
          </Link>
          <Link href="/member/profile">
            <a className="btn-primary btn">Manage Full Profile</a>
          </Link>
        </div>
      </section>
    </>
  );
}

export default withPageAuthRequired(Approved);
