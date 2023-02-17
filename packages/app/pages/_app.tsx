import { ErrorBoundary } from 'components/ErrorBoundary'
import { AppProps } from 'next/app'
import { SessionProvider, SessionContext } from 'next-auth/react'
import { ChakraProvider, cookieStorageManager, extendTheme } from '@chakra-ui/react'
import Layout from 'components/layout/index'
import { theme } from '../theme'
import { MetaContextProvider } from 'hooks/use-meta'
import { Manrope, Arvo, Roboto_Mono } from '@next/font/google'
import { useRouter } from 'next/router'
import { NotificationsProvider, UserContext, UserProvider } from 'hooks'
import { StrictMode } from 'react'
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

extendTheme({
  ...theme,
  fonts: {
    body: body.style.fontFamily,
    heading: heading.style.fontFamily,
    mono: mono.style.fontFamily,
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  if (router?.pathname.startsWith('/qr')) {
    return <Component key={router.asPath} {...pageProps} />
  }

  return (
    <StrictMode>
      <MetaContextProvider>
        <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
          <SessionProvider>
            <UserProvider>
              <NotificationsProvider>
                <Layout fonts={[heading.variable, body.variable, mono.variable]}>
                  <ErrorBoundary>
                    <Component key={router.asPath} {...pageProps} />
                  </ErrorBoundary>
                </Layout>
              </NotificationsProvider>
            </UserProvider>
          </SessionProvider>
        </ChakraProvider>
      </MetaContextProvider>
    </StrictMode>
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
