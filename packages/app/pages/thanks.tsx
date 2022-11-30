import Head from 'next/head';

import Fire from '../components/icons/fire';

export default function Thanks() {
  return (
    <>
      <Head>
        <title>Thanks</title>
      </Head>
      <section className="dark  relative h-[80vh]">
        <h2 className="">Thank you!</h2>
        <p className=" !sm:text-center">
          We&apos;ve received your request. Watch your email for a confirmation.
        </p>

        <Fire />
      </section>
    </>
  );
}
