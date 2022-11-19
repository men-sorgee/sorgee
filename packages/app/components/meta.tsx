import Head from 'next/head';

export interface MetaProps {
  title: string;
  description?: string;
  basePath?: string;
  ogUrl?: string;
  ogImage?: string;
  url?: string;
}

export default function Meta({ props }: { props: MetaProps }) {
  return (
    <Head>
      <title>{props.title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="robots" content="follow, index" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" />
      <meta name="theme-color" content="#7b46f6" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="name" content={props.title} />
      <meta name="description" content={props.description} />
      <meta name="image" content={props.ogImage} />
      <meta name="description" content={props.description} />
      <meta name="og:title" content={props.title} />
      <meta name="og:description" content={props.description} />
      <meta name="og:url" content={props.ogUrl} />
      <meta name="og:image" content={props.ogImage} />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:domain" content="guysnheat.com" />
      <meta name="twitter:url" content={props.ogUrl} />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      {props.ogImage && <meta name="twitter:image" content={props.ogImage} />}
      <meta name="msapplication-TileColor" content="#00aba9" />
      <meta name="theme-color" content="#000" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
    </Head>
  );
}
