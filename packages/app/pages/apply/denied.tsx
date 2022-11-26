import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { tw } from 'twind';
import { useAppUser } from 'lib/hooks/use-member';
import styles from 'styles';
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect } from 'react'
import Link from 'next/link'


function Review() {
  const router = useRouter();
  const { loading, member } = useAppUser();

  useEffect(() => {
    if (member && member!.application_status !== 'denied') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  return (<>
      <Head>
        <title>Application: Denied</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>Application: Denied</h2>

        <p>Unfortunately, your application was denied.</p>
        <p>
          You should receive an email with more information. To 
          re-apply or appeal, please contact us at <a className={tw(styles.link)} 
            href="mailto:support@guysnheat.com">
          support
          </a>.
        </p>
      </section>
    </>)
}

export default withPageAuthRequired(Review);