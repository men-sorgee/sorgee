import {
  AppNotificationsProvider,
  MessagesProvider,
  MetaContextProvider,
  UserNotificationsProvider,
  UserProvider,
} from 'hooks'
import Layout from 'layout'
import { SessionProvider } from 'next-auth/react'
import { AppProps, NextWebVitalsMetric } from 'next/app'
import { Arvo, Manrope, Roboto_Mono } from 'next/font/google'
import { event, GoogleAnalytics } from 'nextjs-google-analytics'
import React from 'react'

import { ChakraProvider, cookieStorageManager, extendTheme } from '@chakra-ui/react'

import { SWRProvider } from '../hooks/swr'
import getTheme from '../theme'

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

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const Content = Component as any
  if (router?.pathname.startsWith('/code/')) {
    return <Content {...pageProps} />
  }

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <MetaContextProvider>
        <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
          <SessionProvider session={pageProps.session}>
            <SWRProvider>
              <UserProvider>
                <AppNotificationsProvider>
                  <UserNotificationsProvider>
                    <MessagesProvider>
                      <React.StrictMode>
                        <Layout fonts={[heading.variable, body.variable, mono.variable]}>
                          <Content {...pageProps} />
                        </Layout>
                      </React.StrictMode>
                    </MessagesProvider>
                  </UserNotificationsProvider>
                </AppNotificationsProvider>
              </UserProvider>
            </SWRProvider>
          </SessionProvider>
        </ChakraProvider>
      </MetaContextProvider>
    </>
  )
}

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  })
}
