import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout/index';
import { AppUserContextProvider } from 'lib/hooks/use-member';
import { AppProps } from 'next/app';
import 'styles/globals.css';
import { MetaContextProvider } from '../lib/hooks/use-meta-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MetaContextProvider>
        <UserProvider loginUrl="/api/auth/login">
          <AppUserContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AppUserContextProvider>
        </UserProvider>
      </MetaContextProvider>
    </>
  );
}

export function reportWebVitals({ id, label, name, value }) {
  if (typeof window !== 'undefined' && typeof window['gtag'] !== 'undefined')
    // Use `window.gtag` if you initialized Google Analytics as this example:
    // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
    window['gtag']('event', name, {
      event_category:
        label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
      event_label: id, // id unique to current page load
      non_interaction: true // avoids affecting bounce rate.
    });
}

export default MyApp;
