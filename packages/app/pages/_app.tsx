import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout/index';
import { AppUserContextProvider } from 'lib/hooks/use-member';
import { AppProps } from 'next/app';
import 'styles/globals.css';
import { MetaContextProvider } from '../lib/hooks/user-meta-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <AppUserContextProvider>
          <MetaContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MetaContextProvider>
        </AppUserContextProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
