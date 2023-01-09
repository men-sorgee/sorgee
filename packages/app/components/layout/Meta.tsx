import { useMeta } from 'hooks/use-meta'
import Head from 'next/head'
import { getAssetUrl } from 'lib/utils'
interface Props {}
const Meta = (_props: Props) => {
  const { title, description, url, image } = useMeta()
  const img = image && !image.includes('/') ? getAssetUrl(image) : image

  return (
    <Head>
      <title key="title">{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="robots" content="follow, index" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" />
      <meta name="theme-color" content="#7b46f6" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="name" content={title} />
      <meta name="description" content={description} />
      {image && <meta name="image" content={img} />}
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      {image && <meta name="og:image" content={img} />}
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:domain" content="guysnheat.com" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={img} />}
      <meta name="msapplication-TileColor" content="#00aba9" />
      <meta name="theme-color" content="#000" />
    </Head>
  )
}

export default Meta
