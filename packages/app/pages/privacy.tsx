import Head from 'next/head';
import { tw } from 'twind';
import _styles from '../_styles';

export default function Learn() {
  const {
    h2page: h2Classes,
    h3section: h3Classes,
    h4callout: h4Classes,
    p: paragraphClasses
  } = _styles;
  return (
    <>
      <Head>
        <title>Privacy</title>
      </Head>
      <iframe
        src="/privacy.html"
        seamless
        className={tw`w-full h-[60vh] bg-white`}
      />
    </>
  );
}
