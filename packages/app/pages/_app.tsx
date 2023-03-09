import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider, cookieStorageManager, extendTheme } from '@chakra-ui/react'
import { onCLS, onFID, onLCP } from 'web-vitals'
import Layout from 'components/layout/index'
import getTheme from '../theme'
import { Manrope, Arvo, Roboto_Mono } from 'next/font/google'
import { useRouter } from 'next/router'
import { MessagesProvider, NotificationsProvider, UserProvider, MetaContextProvider } from 'hooks'

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

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  if (router?.pathname.startsWith('/code/')) {
    return <Component key={router.asPath} {...pageProps} />
  }

  return (
    <SessionProvider session={pageProps.session}>
      <MetaContextProvider>
        <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
          <UserProvider>
            <NotificationsProvider>
              <MessagesProvider>
                  <Layout fonts={[heading.variable, body.variable, mono.variable]}>
                    <Component {...pageProps} />
                  </Layout>
              </MessagesProvider>
            </NotificationsProvider>
          </UserProvider>
        </ChakraProvider>
      </MetaContextProvider>
    </SessionProvider>
  )
}

function sendToGoogleAnalytics({ name, delta, id }) {
  // Assumes the global `ga()` function exists, see:
  // https://developers.google.com/analytics/devguides/collection/analyticsjs
  ga('send', 'event', {
    eventCategory: 'Web Vitals',
    eventAction: name,
    // The `id` value will be unique to the current page load. When sending
    // multiple values from the same page (e.g. for CLS), Google Analytics can
    // compute a total by grouping on this ID (note: requires `eventLabel` to
    // be a dimension in your report).
    eventLabel: id,
    // Google Analytics metrics must be integers, so the value is rounded.
    // For CLS the value is first multiplied by 1000 for greater precision
    // (note: increase the multiplier for greater precision if needed).
    eventValue: Math.round(name === 'CLS' ? delta * 1000 : delta),
    // Use a non-interaction event to avoid affecting bounce rate.
    nonInteraction: true,
    // Use `sendBeacon()` if the browser supports it.
    transport: 'beacon',
  })
}

// if (window && document != undefined) {
//   onCLS(sendToGoogleAnalytics)
//   onFID(sendToGoogleAnalytics)
//   onLCP(sendToGoogleAnalytics)
// }
