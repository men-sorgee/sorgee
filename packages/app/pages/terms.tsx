import Head from 'next/head';
import Script from 'next/script';
import { tw } from 'twind';

export default function Learn() {
  return (
    <>
      <Head>
        <title>Terms Conditions</title>
      </Head>
      <section className={tw`min-h-[80vh]`}>
        <div
          name="termly-embed"
          data-id="287910e8-202f-4cb6-b61f-4ce31f011de8"
          data-type="iframe"
        ></div>
        <Script
          id="termly-jssdk"
          src="https://app.termly.io/embed-policy.min.js"
          type="text/javascript"
        />
      </section>
    </>
  );
}
