import Head from 'next/head';
import { tw } from 'twind';
import styles from 'styles';

export default function About() {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <section className={tw`w-full p-8 bg-white text-black text-left`}>
        <h2 className={tw`${styles.h2page}`}>About</h2>
        <h3 className={tw`${styles.h3section}`}>Our Mission</h3>
        <p className={tw`${styles.pLg}`}>
          To revolutionize the way men meet other men; provide a safe, secure
          and discreet environment for bi/married men who are looking to meet
          and/or hook up with other men.
        </p>
        <h3 className={tw`${styles.h3section}`}>Our Vision</h3>
        <p className={tw`${styles.pLg}`}>
          Many gay dating apps allow you to swipe right and left, connecting
          based on superficial information. GuysnHeat is different. We believe
          in connecting men based on their wants and needs, not just their
          physical appearance.
        </p>
        <p className={tw`${styles.pLg}`}>
          Our members are looking for a real connection, not just a hookup.
          We&apos;ve created an app that allows you to meet other men who are
          looking for the same thing: A guy who is interested in more than just
          sex!
        </p>
        <h4 className={tw`${styles.h4callout}`}>
          We&apos;re committed to providing the best possible experience for our
          members.
        </h4>
      </section>
    </>
  );
}
