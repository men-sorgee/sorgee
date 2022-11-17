import Head from 'next/head';
import { tw } from 'twind';
import _styles from '../styles';

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
        <title>Learn</title>
      </Head>
      <section className={tw`w-full p-8 bg-white text-black`}>
        <h2 className={tw`${h2Classes}`}>Learn</h2>
        <h3 className={tw`${h3Classes}`}>How it Works</h3>
      </section>
    </>
  );
}
