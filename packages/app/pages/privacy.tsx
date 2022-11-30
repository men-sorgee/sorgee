import Head from 'next/head';
import Script from 'next/script';
export default function Learn() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>

      <div
        name={'termly-embed'}
        data-id="f94e7630-c543-4da1-9ae7-e74267043d70"
        data-type="iframe"
      ></div>
      <Script
        strategy="lazyOnload"
        id="termly-jssdk"
        src="https://app.termly.io/embed-policy.min.js"
        type="text/javascript"
      />
    </>
  );
}
