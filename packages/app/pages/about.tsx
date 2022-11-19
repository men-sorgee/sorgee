import Head from 'next/head';
import { tw } from 'twind';
import styles from 'styles';

export default function About() {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw`${styles.h2page}  !text-left`}>About</h2>
        <h3 className={tw`${styles.h3section}  !text-left`}>Our Mission</h3>
        <p className={tw`${styles.pLg}  !text-left`}>
          To revolutionize the way men meet other men; provide a safe, secure
          and discreet environment for bi/married men who are looking to meet
          and/or hook up with other men.
        </p>
        <h3 className={tw`${styles.h3section}  !text-left`}>Our Vision</h3>
        <p className={tw`${styles.pLg}  !text-left`}>
          Many dating apps allow you to swipe right and left, connecting based
          on superficial information. GuysnHeat is different. We believe in
          connecting men based on their wants and needs, not just their physical
          appearance.
        </p>
        <p className={tw`${styles.pLg}  !text-left`}>
          Our members are looking for a real connection. We&apos;ve created an
          app that allows you to meet other men who are looking for the same
          things!
        </p>
        <h4 className={tw`${styles.h4callout}  !text-left`}>
          Want to help or give us feedback on the app? <br />
        </h4>
        <h5 className={tw`text-white text-left text-xl mt-4`}>
          Join our Discord:
        </h5>
        <iframe
          className={tw` mt-8`}
          src="https://discord.com/widget?id=1010067299023192084&theme=dark"
          width="350"
          height="350"
          allowTransparency="true"
          frameborder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </section>
    </>
  );
}
