import Layout from "layout";
import Providers from "layout/Providers";
import { AppProps } from "next/app";
import { Arvo, Manrope, Roboto_Mono } from "next/font/google";
import React from "react";

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

