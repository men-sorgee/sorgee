import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from 'lib/hooks/use-member';

import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';

function Denied() {
  const router = useRouter();
  const { loading, member } = useAppUser();

  useEffect(() => {
    if (member && member!.application_status !== 'denied') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  return (
    <>
      <Head>
        <title>Application Denied</title>
      </Head>
      <section className="dark ">
        <h1>Application Denied</h1>

        <p>Unfortunately, your application was denied.</p>
        <p>
          You should receive an email with more information. To re-apply or
          appeal, please contact us at{' '}
          <a className="link" href="mailto:support@guysnheat.com">
            support
          </a>
          .
        </p>
      </section>
    </>
  );
}

export default withPageAuthRequired(Denied);
