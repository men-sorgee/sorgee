import Layout from "layout";
import Providers from "layout/Providers";
import * as gtag from "lib/utils/gtm";
import { AppProps } from "next/app";
import { Arvo, Manrope, Roboto_Mono } from "next/font/google";
import React, { useEffect } from "react";

import {
  ChakraProvider,
  cookieStorageManager,
  extendTheme
} from "@chakra-ui/react";

import getTheme from "../theme";
import WebVitals from "./_vitals";

const heading = Arvo({
  variable: '--heading-font',
  weight: ['400', '700'],
  subsets: ['latin'],
})

const body = Manrope({
  variable: '--body-font',
  weight: 'variable',
  subsets: ['latin'],
})

const mono = Roboto_Mono({
  variable: '--mono-font',
  weight: 'variable',
  subsets: ['latin'],
})

const theme = extendTheme(getTheme(body, heading, mono))

export default function GNHApp({ Component, pageProps, router }: AppProps) {
  const Content = Component as any

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageView(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  if (router?.asPath.startsWith('/code/')) {
    return <Content {...pageProps} />
  }
  return (
    <>

      <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
        <React.StrictMode>
          <Providers session={pageProps.session}>
            <Layout fonts={[heading.variable, body.variable, mono.variable]}>
              <Content {...pageProps} />
            </Layout>
          </Providers>
        </React.StrictMode>
      </ChakraProvider>
      <WebVitals />
    </>
  )
}

// export default dynamic(() => Promise.resolve(GNHApp), {
//   ssr: false,
// });

