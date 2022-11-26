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
    if (member && member!.application_status !== 'approved') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  return (<>
      <Head>
        <title>Application: Approved</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>Application: Approved</h2>

        <p>Congratulations! Your membership was approved.</p>
        <p>
          You will now get periodic event invites as well as
          access to our member-only content.
        </p>
        <div className={tw`flex flex-row justify-center items-center space-x-4 mt-2 pt-4`}>
          <Link href="/member/invite">
            <a className={tw(styles.buttonPrimary)}>
              Invite a Friend
            </a>
          </Link>
          <Link href="/member/profile">
            <a className={tw(styles.buttonPrimary)}>
              Manage Full Profile
            </a>
          </Link>
        </div>
      </section>
    </>)
}

export default withPageAuthRequired(Review);