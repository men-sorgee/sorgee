import Layout from "layout";
import Providers from "layout/Providers";
import * as gtag from "lib/utils/gtm";
import { AppProps } from "next/app";
import React, { useEffect } from "react";

import WebVitals from "./_vitals";

export default function App({ Component, pageProps, router }: AppProps) {
  const Content = Component as any

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageView(url, pageProps?.session?.user?.id || undefined)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [pageProps?.session?.user?.id, router.events])

  if (router?.asPath.startsWith('/code/')) {
    return <Content {...pageProps} />
  }
  return (
    <>
      <React.StrictMode>
        <Providers session={pageProps.session}>
          <Layout >
            <Content {...pageProps} />
          </Layout>
        </Providers>
      </React.StrictMode>

      <WebVitals />
    </>
  )
}
