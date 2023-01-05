import { ErrorBoundary } from 'components/ErrorBoundary'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider, cookieStorageManager, extendTheme } from '@chakra-ui/react'
import Layout from 'components/layout/index'
import { theme } from '../theme'
import { LocationProvider } from '../hooks/use-location'
import { MetaProvider } from '../hooks/use-meta'
import { SocketProvider } from '../hooks/use-socket'
import { Manrope, Arvo, Roboto_Mono } from '@next/font/google'

const heading = Arvo({
  variable: '--heading-font',
  weight: ['400', '700'],
})

const body = Manrope({
  variable: '--body-font',
  weight: 'variable',
})

const mono = Roboto_Mono({
  variable: '--mono-font',
  weight: 'variable',
})

extendTheme({
  ...theme,
  fonts: {
    body: body.style.fontFamily,
    heading: heading.style.fontFamily,
    mono: mono.style.fontFamily,
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
        <MetaProvider>
          <SocketProvider>
            <LocationProvider>
              <Layout fonts={[heading.variable, body.variable, mono.variable]}>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
            </LocationProvider>
          </SocketProvider>
        </MetaProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}

export function reportWebVitals({ id, label, name, value }) {
  if (typeof window !== 'undefined' && typeof window['gtag'] !== 'undefined')
    // Use `window.gtag` if you initialized Google Analytics as this example:
    // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
    window['gtag']('event', name, {
      event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
      event_label: id, // id unique to current page load
      non_interaction: true, // avoids affecting bounce rate.
    })
}

export default MyApp
