import Head from 'next/head';
import { tw } from 'twind';
import styles from 'styles';

export default function Learn() {
  return (
    <>
      <Head>
        <title>Learn</title>
      </Head>
      <section className={tw`w-full p-8 bg-white text-black`}>
        <h2 className={tw`${styles.h2page}`}>Learn</h2>
        <h3 className={tw`${styles.h3section}`}>How it Works</h3>
      </section>
    </>
  );
}
