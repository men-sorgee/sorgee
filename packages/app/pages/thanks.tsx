import Head from 'next/head';
import _styles from '_styles';
import { tw } from 'twind';

export default function Thanks() {
  const { h2page: h2Classes } = _styles;
  return (
    <>
      <Head>
        <title>Thanks</title>
      </Head>
      <section className={tw`w-full p-8 bg-white text-black`}>
        <h2 className={tw`${h2Classes}`}>Thank you for your interest!</h2>
      </section>
    </>
  );
}
