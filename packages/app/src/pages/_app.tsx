import React from 'react'
import { GoogleAnalytics, event } from 'nextjs-google-analytics'
import {
  MessagesProvider,
  MetaContextProvider,
  AppNotificationsProvider,
  UserNotificationsProvider,
  UserProvider
} from 'hooks'
import Layout from 'layout'
import { SessionProvider } from 'next-auth/react'
import { AppProps, NextWebVitalsMetric } from 'next/app'
import { Arvo, Manrope, Roboto_Mono } from 'next/font/google'
import { useRouter } from 'next/router'

import {
  ChakraProvider,
  cookieStorageManager,
  extendTheme
} from '@chakra-ui/react'

import getTheme from '../theme'

const heading = Arvo({
  variable: '--heading-font',
  weight: ['400', '700'],
  subsets: ['latin']
})

const body = Manrope({
  variable: '--body-font',
  weight: 'variable',
  subsets: ['latin']
})

const mono = Roboto_Mono({
  variable: '--mono-font',
  weight: 'variable',
  subsets: ['latin']
})

const theme = extendTheme(getTheme(body, heading, mono))

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  if (router?.pathname.startsWith('/code/')) {
    return <Component key={router.asPath} {...pageProps} />
  }

  return (
    <>
      <GoogleAnalytics trackPageViews gaMeasurementId="G-SJX78PVP26" />
      <SessionProvider session={pageProps.session}>
        <MetaContextProvider>
          <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
            <UserProvider>
              <AppNotificationsProvider>
                <UserNotificationsProvider>
                  <MessagesProvider>
                    <React.StrictMode>
                      <Layout
                        fonts={[heading.variable, body.variable, mono.variable]}
                      >
                        <Component {...pageProps} />
                      </Layout>
                    </React.StrictMode>
                  </MessagesProvider>
                </UserNotificationsProvider>
              </AppNotificationsProvider>
            </UserProvider>
          </ChakraProvider>
        </MetaContextProvider>
      </SessionProvider>
    </>
  )
}

export function reportWebVitals({
  id,
  name,
  label,
  value
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true // avoids affecting bounce rate.
  })
}
