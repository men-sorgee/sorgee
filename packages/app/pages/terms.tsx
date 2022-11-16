import Head from 'next/head';
import { tw } from 'twind';

export default function Learn() {
  return (
    <>
      <Head>
        <title>Terms Conditions</title>
      </Head>
      <iframe
        src="/terms.html"
        seamless
        className={tw`w-full h-[60vh] bg-white`}
      />
    </>
  );
}
