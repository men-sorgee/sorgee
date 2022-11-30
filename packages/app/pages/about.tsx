import Head from 'next/head';
export default function About() {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <section className="dark ">
        <h2>About</h2>
        <h3>Our Mission</h3>
        <p>
          To revolutionize the way men meet other men; provide a safe, secure
          and discreet environment for bi/married men who are looking to meet
          and/or hook up with other men.
        </p>
        <h3>Our Vision</h3>
        <p className="text-xl">
          Many dating apps allow you to swipe right and left, connecting based
          on superficial information. GuysnHeat is different. We believe in
          connecting men based on their wants and needs, not just their physical
          appearance.
        </p>
        <p className="!text-left   text-xl">
          Our members are looking for a real connection. We&apos;ve created an
          app that allows you to meet other men who are looking for the same
          things!
        </p>
        <h4 className="   !text-left">
          Want to help or give us feedback on the app? <br />
        </h4>
        <h5 className="mt-4 text-left text-xl text-white">Join our Discord:</h5>
        <iframe
          className=" mt-8"
          src="https://discord.com/widget?id=1010067299023192084&theme=dark"
          width="350"
          height="350"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </section>
    </>
  );
}
