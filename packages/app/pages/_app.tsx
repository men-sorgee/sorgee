import { ChakraProvider, cookieStorageManager, localStorageManager } from '@chakra-ui/react'
import Layout from 'components/layout/index'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { MetaContextProvider } from 'hooks'
import { theme } from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MetaContextProvider>
        <SessionProvider>
          <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
            <Layout>
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
            </Layout>
          </ChakraProvider>
        </SessionProvider>
      </MetaContextProvider>
    </>
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
