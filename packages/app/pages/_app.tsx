import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout/index';
import { AppUserContextProvider } from 'lib/hooks/use-member';
import { AppProps } from 'next/app';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <AppUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppUserContextProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
