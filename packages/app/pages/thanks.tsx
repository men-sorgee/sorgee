import Head from 'next/head';
import styles from '_styles';
import { tw } from 'twind';
import Fire from '../components/icons/fire';

export default function Thanks() {
  return (
    <>
      <Head>
        <title>Thanks</title>
      </Head>
      <section className={tw`${styles.sectionDark} relative h-[40vh]`}>
        <h2 className={tw(styles.h2page)}>Thank you!</h2>
        <p className={tw(styles.p)}>
          We&apos;ve received your request and will be in touch shortly.
        </p>

        <Fire />
      </section>
    </>
  );
}
