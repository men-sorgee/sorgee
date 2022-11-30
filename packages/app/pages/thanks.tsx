import Head from 'next/head';

import Fire from '../components/icons/fire';
import { useMeta } from '../lib/hooks/user-meta-context';

export default function Thanks() {
  useMeta('Thank You');
  return (
    <>
      <section className="dark ">
        <h2 className="">Thank you!</h2>
        <p className="text-center">
          We&apos;ve received your request. Watch your email for a confirmation.
        </p>

        <Fire />
      </section>
    </>
  );
}
