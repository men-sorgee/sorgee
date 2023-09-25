import { useMeta } from "hooks/use-meta";
import { baseUrl } from "lib/config";
import { getAssetUrl } from "lib/utils";
import Head from "next/head";

interface Props { }
const Meta = (_props: Props) => {
  const { title, description, url, image } = useMeta()
  const img = image && !image.includes('/') ? getAssetUrl(image) : image

  return (
    <Head>
      <title key="title">{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={`${baseUrl}${url}`} />
      <meta name="robots" content="follow, index" />
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />
      <meta name="name" content={title} />
      <meta name="description" content={description} />
      {image && <meta name="image" content={img} />}
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      {image && <meta name="og:image" content={img} />}
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content={img} />
      <meta name="twitter:domain" content="guysnheat.com" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={img} />}
      <meta name="msapplication-TileColor" content="#000000" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" />
      <meta name="theme-color" content="#7b46f6" />
      <meta name="application-name" content="GuysNHeat" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="PWA App" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-tap-highlight" content="no" />

    </Head>
  )
}

export default Meta
