import Script from 'next/script';
import { setMeta } from 'lib/hooks/use-meta-context';

export default function Learn() {
  setMeta('Privacy Policy');
  return (
    <>
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
