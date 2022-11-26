import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { tw } from 'twind';
import { useMember } from 'lib/hooks/use-member';
import styles from 'styles';
import { NextRouter, useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect } from 'react'


function Review() {
  const router = useRouter();
  const { loading, member } = useMember();

  useEffect(() => {
    if (member && member!.application_status !== 'review') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  return (<>
      <Head>
        <title>Application: In Review</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>Application: In Review</h2>

        <p>Thank you for submitting your application and verification photo.</p>
        <p>Your application is currently being reviewed by our team.</p>
        
      </section>
    </>)
}

export default withPageAuthRequired(Review);